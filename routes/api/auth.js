const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {authenticateUser, checkUserAuthentication } = require('../../controllers/auth');

const User = require('../../models/User');

// @GET api/auth
// @access public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// @POST api/auth
// @desc authenticate existing user
// @access public
router.post('/', checkUserAuthentication, authenticateUser);


module.exports = router;