const {check, validationResult } = require('express-validator/check');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const checkUserAuthentication = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter your password').exists()
]

const authenticateUser = async (req, res) => {
    //Check if there are errors in the registration data
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const { email, password } = req.body;
    try {
        //Raise error if user does not exist
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({errors: [{msg: 'User does not exist'}]})
        }

        //Check if passwords match
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({errors: [{msg: 'Incorrect password'}]})
        }

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

module.exports = {authenticateUser, checkUserAuthentication};