const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { 
    validateProfile, 
    getProfile, 
    updateProfile, 
    getAllProfiles, 
    getProfileById,
    deleteProfile 
    } = require('../../controllers/profile');


// @GET api/profile/me (individual user profile)
// @access private
router.get('/me', auth, getProfile);


// @POST api/profile
// @desc create or update user profile
// @access private
router.post('/', [auth, validateProfile], updateProfile);



// @GET api/profile
// @desc get all profiles
// @access public
router.get('/', getAllProfiles);



// @GET api/profile/:user_id
// @desc get profile by user id
// @access public
router.get('/:user_id', getProfileById);


// @DELETE api/profile
// @desc delete profile and user
// @access private
router.delete('/', auth, deleteProfile);


module.exports = router;