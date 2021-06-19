const {check, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');


const validateProfile = [
    check('bio', 'Please add your biography').not().isEmpty()
]

const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        //If there is no profile
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});

        }
    } catch (err) {
        console.error(err.message); 
        return res.status(500).send('Server error')
    }
}


const updateProfile = async (req, res) => {
    //If there are errors in the profile fields
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }

    //Update profile fields
    const {
        dateOfBirth, 
        location, 
        bio, 
        hobbies, 
        youtube,
        facebook,
        instagram,
        twitter,
        linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if(dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(hobbies) profileFields.hobbies = hobbies.split(',').map(hobby => hobby.trim());
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(instagram) profileFields.social.instagram = instagram;
    if(twitter) profileFields.social.twitter = twitter;
    if(linkedin) profileFields.social.linkedin = linkedin;
    console.log(profileFields.social.youtube);
    
    try {
        let profile = await Profile.findOne({ user: req.user.id});

        //If there is a profile, update
        if(profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields}, 
                {new : true}
            );
            return res.json(profile);
        }

        //If there is no profile, create it
        if(!profile) {
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
}


const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);
    } catch (error) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
}


const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({msg: 'Profile not found'})
        }
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == "ObjectId") {
            return res.status(400).json({msg: 'Profile not found'})
        }
        res.status(500).json('Server error');
    }
}

const deleteProfile = async (req, res) => {
    try {
        //This will remove profile, user and posts
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        return res.send('Profile deleted')
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
}


module.exports = {
    validateProfile, 
    getProfile, 
    updateProfile, 
    getAllProfiles, 
    getProfileById,
    deleteProfile
};
