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

const experienceSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    experience:[
        {
            title: propertiesRequiredTrue,
            company: propertiesRequiredTrue,

            location: propertiesRequiredFalse,
            startedFrom: {
                type: Date,
                required: true
            },
            to: Date,
            current:{
                type: Boolean,
                default: false
            },
            description: propertiesRequiredFalse
        }
    ]
})

const Experience = mongoose.model('experience', experienceSchema)

const validateExperience = (experience) => {
    const required = Joi.string().min(2).max(225).required()
    const notRequired = Joi.string().min(2).max(225)
    
    const schema = {
        user: JoiObjectId().required(),
        title: required,
        company: required,
        location: notRequired,
        startedFrom: Joi.date().required(),
        to: Joi.date(),
        current: Joi.boolean(),
        description: notRequired,
    }

    return Joi.validate(experience, schema)
}

module.exports.Experience = Experience
module.exports.validate = validateExperience