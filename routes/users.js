const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {
   User
} = require('../models/User')
const {
   Profile
} = require('../models/Profile')
const {
   Experience
} = require('../models/Experience')
const {
   Education
} = require('../models/Education')

const auth = require('../middleware/auth')
const authorization = require('../middleware/authorization')


/*
 * @route GET /api/users/me
 * @desc Returns details about current user
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
   const user = await User.findById(req.user._id).select('-password')
   res.send(user)
})

/*
 * @route GET /api/users/all
 * @desc Returns profile details about all users with profiles
 * @access Public
 */
router.get('/all', async (req, res) => {
   const users = await User.find({})

   if (users.length === 0) return res.status(404).send('No users exists')

   res.send(users)
})

router.delete('/me', [auth, authorization], async (req, res) => {
   let user = req.user._id
   const username = req.query.username || '%'

   // findUser = await User.findById(user)

   // console.log(findUser);

   // if (!findUser) return res.status(404).send('No user exists. Register new user instead')

   const session = await mongoose.startSession()
   session.startTransaction()

   try {
      if (username === '%') {
         user = await User.findByIdAndRemove(user)

         return res.status(200).send(user)

      }

      user = user = await User.findByIdAndRemove(user)

      const profile = await Profile.findOneAndRemove({
         username
      })

      const experience = await Experience.findOneAndRemove({
         user: mongoose.Types.ObjectId(user)
      })

      const education = await Education.findOneAndRemove({
         user: mongoose.Types.ObjectId(user)
      })

      const totalRemoved = {
         user,
         profile,
         experience,
         education
      }

      await session.commitTransaction()
      session.endSession()

      res.send(totalRemoved)
   } catch (error) {
      await session.abortTransaction()
      session.endSession()

      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
      }
   }
})



module.exports = router