const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Joi = require('joi')
const _ = require('lodash')

const {
    User
} = require('../models/User')

/*
 * @route POST /api/login
 * @desc Login route
 * @access Public
 */

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    let user
    const {
        email,
        password
    } = req.body

    user = await User.findOne({
        email
    })
    if (!user) return res.status(404).send({
        email: 'User with that email does not exist'
    })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send({
        password: `Invalid password for ${email}`
    })

    try {
        const token = user.generateAuthToken()
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'avatar']))
    } catch (error) {
        for (const field in error.errors) {
            console.log(error.errors[field].message);
            res.send(error.errors[field].message)
        }
    }
})


const validate = (requestBody) => {
    const schema = {
        email: Joi.string().min(8).max(225).email().required(),
        password: Joi.string().min(5).max(225).required()
    }

    return Joi.validate(requestBody, schema)
}


module.exports = router