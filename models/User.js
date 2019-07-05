const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const properties = {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 225
}

const userSchema = new mongoose.Schema({
    name: properties,
    email: {
        ...properties,
        minlength: 8,
        unique: true
    },
    password: {
        ...properties,
        minlength: 5,
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    hasProfile: {
        type: Boolean,
        default: false
    }

})

userSchema.methods.generateAuthToken = function () {
    const payload = {
        _id: this._id,
        name: this.name,
        email: this.email,
        avatar: this.avatar
    }
    const privateKey = config.get('jwtPrivateKey')
    
    const token = jwt.sign(payload, privateKey, { expiresIn: "1d"})

    return token
}

const User = mongoose.model('user', userSchema)

const validateUser = (user) => {
   const schema = {
       name: Joi.string().min(2).max(225).required(),
       email: Joi.string().email().min(8).max(225).required(),
       password: Joi.string().min(5).max(225).required(),
       avatar: Joi.string(),
       date: Joi.date(),
       hasProfile: Joi.boolean()
   } 

   return Joi.validate(user, schema)
}


module.exports.User = User
module.exports.validate = validateUser