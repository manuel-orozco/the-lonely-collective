const {check, validationResult } = require('express-validator');
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const checkUserRegistration = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with at least 6 characters').isLength({min:6})
]

const registerUser = async (req, res) => {
    //Check if there are errors in the registration data
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const { name, email, password } = req.body;
    try {
        //See if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({errors: [{msg: 'User already exists'}]})
        }

        //Get gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        //Create new user
        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt password using 10 rounds
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //Return json webtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, (err, token) => {
            if(err) throw err;
            res.json({token});
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }  
    
};

module.exports = {registerUser, checkUserRegistration};