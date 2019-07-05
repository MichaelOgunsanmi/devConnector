const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const _ = require('lodash')

const { User, validate } = require('../models/User')


/*
* @route POST /api/register
* @desc Registration route
* @access Public
*/
router.post('/', async (req, res) => {
   const { error } = validate(req.body)
   if(error) return res.status(400).send(error.details[0].message)

   const { name, email, password } = req.body
   let user 

   user = await User.findOne({ email })
   if (user) return res.status(400).send('User already registered')

   const avatar = gravatar.url(email, {
      s: '200', // size
      r: 'pg', // rating
      d:'retro' // default 
   })

   user = new User({
       name, 
       email,
       password, 
       avatar
      })

   const salt = await bcrypt.genSalt(10)
   user.password = await bcrypt.hash(user.password, salt)

   try {
      user = await user.save()
      const token = user.generateAuthToken()
      res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'avatar']))
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
       }
   }

})


module.exports = router