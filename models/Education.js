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

const educationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    education:[
        {
            school: propertiesRequiredTrue,
            degree: propertiesRequiredTrue,
            fieldOfStudy: propertiesRequiredTrue,
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

const Education = mongoose.model('education', educationSchema)

const validateEducation = (education) => {
    const required = Joi.string().min(2).max(225).required()
    const notRequired = Joi.string().min(2).max(225)
    
    const schema = {
        user: JoiObjectId().required(),
        school: required,
        degree: required,
        fieldOfStudy: required,
        startedFrom: Joi.date().required(),
        to: Joi.date(),
        current: Joi.boolean(),
        description: notRequired,
    }
    return Joi.validate(education, schema)
}

module.exports.Education = Education
module.exports.validate = validateEducation