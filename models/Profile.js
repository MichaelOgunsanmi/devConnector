const mongoose = require('mongoose')
const Joi = require('joi')
const JoiObjectId = require('joi-objectid')(Joi)

const propertiesRequiredTrue = {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 225
}

const propertiesRequiredFalse = {
    ...propertiesRequiredTrue,
    required: false
}

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    username: {
        ...propertiesRequiredTrue,
        unique: true
    },
    status: {
        ...propertiesRequiredTrue,
        minlength: 5
    },
    skills: {
        ...propertiesRequiredTrue,
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now
    },
    company: propertiesRequiredFalse,
    website: propertiesRequiredFalse,
    location: propertiesRequiredFalse,
    bio: propertiesRequiredFalse,
    githubUsername: propertiesRequiredFalse,
    social: {
        youtube: propertiesRequiredFalse,
        twitter: propertiesRequiredFalse,
        facebook: propertiesRequiredFalse,
        linkedin: propertiesRequiredFalse,
        instagram: propertiesRequiredFalse
    }
})

const Profile = mongoose.model('profile', profileSchema)

const validateProfile = (profile) => {
    const required = Joi.string().min(2).max(225).required()
    const notRequired = Joi.string().min(2).max(225)
    const url = Joi.string().uri({
        scheme: ['http', 'https']
    }).required()

    const schema = {
        user: JoiObjectId().required(),
        username: required,
        status: Joi.string().min(5).max(225).required(),
        skills: required,
        date: Joi.date(),
        company: notRequired,
        website: notRequired,
        location: notRequired,
        bio: notRequired,
        githubUsername: notRequired,
        youtube: url,
        twitter: url,
        facebook: url,
        linkedin: url,
        instagram: url
    }

    return Joi.validate(profile, schema)
}



module.exports.Profile = Profile
module.exports.validate = validateProfile