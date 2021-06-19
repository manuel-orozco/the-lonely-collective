const express = require('express');

const router = express.Router();
const {check, validationResult } = require('express-validator/check');
const {registerUser, checkUserRegistration } = require('../../controllers/users');

// @POST api/users
// @desc register new user
// @access public
router.post('/', checkUserRegistration, registerUser);

module.exports = router;