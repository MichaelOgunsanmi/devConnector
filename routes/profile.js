const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {
   User
} = require('../models/User')
const {
   Profile,
   validate
} = require('../models/Profile')
const {
   Education
} = require('../models/Education')
const {
   Experience
} = require('../models/Experience')

const auth = require('../middleware/auth')
const authorization = require('../middleware/authorization')

//const getUsername = require('./getUsername')



/*
 * @route GET /api/profile/me?username=usernameValue
 * @desc Returns profile details about current user
 * @access Private
 */
// router.get('/me', [ auth, authorization ], async(req, res) => {
//getUsername()
//    const profile = await Profile.findOne({user: req.user._id}).populate('user', ['name', 'avatar'])

//    res.send(profile)
// })

/*
 * @route GET /api/profile/all
 * @desc Returns profile details about all users with profiles
 * @access Public
 */
router.get('/all', async (req, res) => {
   const profiles = await Profile
      .find({})
      .populate('user', ['name', 'avatar'])

   if (profiles.length === 0) return res.status(404).send('No profiles exists')

   res.send(profiles)
})

/*
 * @route GET /api/profile/username
 * @desc Returns profile details about username
 * @access Public
 */
router.get('/:username', async (req, res) => {
   const profile = await Profile.findOne({
      username: req.params.username
   }).populate('user', ['name', 'avatar'])
   if (!profile) return res.status(404).send(`No profile exists for ${req.params.username}`)

   res.send(profile)
})

/* 
 * @route POST /api/profile/  
 * @desc Creates profile based on response from input fields
 * @access Private
 */
router.post('/', auth, async (req, res) => {
   const user = req.user._id
   req.body.user = user

   let profile
   profile = await Profile.findOne({
      user
   })
   if (profile) return res.status(400).send(`Profile already exists for ${req.user.name}, update profile instead`)

   const {
      error
   } = validate(req.body)
   if (error) return res.status(400).send(error.details[0].message)

   const {
      username,
      status,
      skills,
      company,
      website,
      location,
      bio,
      githubUsername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
   } = req.body

   const findUsername = await Profile.findOne({
      username
   })
   if (findUsername) return res.status(400).send('Username already  exists, choose another username')

   const social = {
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
   }

   let skill
   if (skills) {
      skill = skills.split(',').map(skill => skill.trim())
   }

   profile = new Profile({
      user,
      username,
      status,
      skills: skill,
      company,
      website,
      location,
      bio,
      githubUsername,
      social
   })

   const session = await mongoose.startSession()
   session.startTransaction()


   try {
      profile = await profile.save()

      console.log(user);

      let userhasProfile = await User.findOneAndUpdate({
         _id: mongoose.Types.ObjectId(user)
      }, {
         $set: {
            hasProfile: true
         }
      }, {
         new: true
      })

      const total = {
         userhasProfile,
         profile
      }

      await session.commitTransaction()
      session.endSession()

      res.send(total)
   } catch (error) {
      await session.abortTransaction()
      session.endSession()

      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
      }
   }
})

/* 
 * @route PUT /api/profile/username 
 * @desc Updates profile based on response from input fields
 * @access Private
 */

router.put('/:username', [auth, authorization], async (req, res) => {
   // getUsername()
   const user = req.user._id
   req.body.user = user

   const {
      error
   } = validate(req.body)
   if (error) return res.status(400).send(error.details[0].message)

   const {
      username,
      status,
      skills,
      company,
      website,
      location,
      bio,
      githubUsername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
   } = req.body

   const findUsername = await Profile.findOne({
      username
   })
   if (findUsername) return res.status(400).send('Username already  exists, choose another username')

   const social = {
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
   }

   let skill
   if (skills) {
      skill = skills.split(',').map(skill => skill.trim())
   }

   const profile = await Profile.findOneAndUpdate({
      username: req.params.username
   }, {
      user,
      username,
      status,
      skills: skill,
      company,
      website,
      location,
      bio,
      githubUsername,
      social
   }, {
      new: true
   })

   try {
      profile = await profile.save()

      res.send(profile)
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
      }
   }
})

/*
 * @route DELETE /api/profile/:username 
 * @desc Finds profile based on query parameters and deletes the particular profile
 * @access Private
 */
router.delete('/:username', [auth, authorization], async (req, res) => {
   const user = req.user._id

   const session = await mongoose.startSession()
   session.startTransaction()

   try {
      const profile = await Profile.findOneAndRemove({
         username: req.params.username
      })

      const experience = await Experience.findOneAndRemove({
         user: mongoose.Types.ObjectId(user)
      })

      const education = await Education.findOneAndRemove({
         user: mongoose.Types.ObjectId(user)
      })

      const totalRemoved = {
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