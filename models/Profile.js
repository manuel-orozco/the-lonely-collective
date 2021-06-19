const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dateOfBirth: {
        type: Date
    },  
    location: {
        type: String
    }, 
    bio: {
        type: String,
        required: true
    },
    hobbies: {
        type: [String]
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
    }
});

module.exports = Profile = mongoose.model('profile', profileSchema);