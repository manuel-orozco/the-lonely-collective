const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validateProfile, getProfile, updateProfile } = require('../../controllers/profile');


// @GET api/profile/me (individual user profile)
// @access private
router.get('/me', auth, getProfile);


// @POST api/profile
// @desc create or update user profile
// @access private
router.post('/', [auth, validateProfile], updateProfile);



module.exports = router;