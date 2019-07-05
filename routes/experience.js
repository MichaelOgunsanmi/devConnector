const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {
   Experience,
   validate
} = require('../models/Experience')
const {
   Profile
} = require('../models/Profile')

const auth = require('../middleware/auth')
const authorization = require('../middleware/authorization')

/*
 * @route GET /api/experience/me
 * @desc Returns experience details about current user
 * @access Private
 */
router.get('/:username', [auth, authorization], async (req, res) => {
   const experience = await Experience.findOne({
      user: req.user._id
   }).populate('user', ['name', 'avatar'])
   if (!experience) return res.status(404).send(`No experience exists for ${req.user.name}`)

   res.send(experience)
})

/*
 * @route GET /api/experience/all
 * @desc Returns experience details about all users with experience
 * @access Public
 */
router.get('/all', async (req, res) => {
   const experience = await Experience
      .find({})
      .populate('user', ['name', 'avatar'])

   if (experience.length === 0) return res.status(404).send('No experience exists')

   res.send(experience)
})

/*
 * @route GET /api/experience/username
 * @desc Returns experience details about username
 * @access Public
 */
router.get('/:username', async (req, res) => {
   let user = await Profile.findOne({
      username: req.params.username
   })
   user = user.user

   const experience = await Experience.findOne({
      user
   }).populate('user', ['name', 'avatar'])
   if (!experience) return res.status(404).send(`No experience exists for ${req.params.username}`)

   res.send(experience)
})

/*
 * @route POST /api/experience/  
 * @desc Creates user work experience with no prior experience or add new experience to experience list based on response from input fields
 * @access Private
 */
router.post('/:username', [auth, authorization], async (req, res) => {
   const user = req.user._id
   req.body.user = user

   const {
      error
   } = validate(req.body)
   if (error) return res.status(400).send(error.details[0].message)

   const {
      title,
      company,
      location,
      startedFrom,
      to,
      current,
      description
   } = req.body

   const findDuplicate = await Experience.findOne({
      $and: [{
         user: mongoose.Types.ObjectId(user)
      }, {
         experience: {
            $elemMatch: {
               title,
               company,
               startedFrom
            }
         }
      }]
   })

   if (findDuplicate) return res.status(400).send('Experience already added.')

   let experience

   experience = {
      title,
      company,
      location,
      startedFrom,
      to,
      current,
      description
   }

   const findUser = await Experience.findOne({
      user
   })


   if (!findUser) {
      experienceArray = []

      experienceArray.push(experience)

      experience = new Experience({
         user,
         experience: experienceArray
      })
   } else {
      experience = await Experience.findOneAndUpdate({
         user
      }, {
         $push: {
            experience
         }
      }, {
         new: true
      })
   }

   try {

      experience = await experience.save()

      res.send(experience)
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);

         res.send(error.errors[field].message)
      }
   }
})

/*
 * @route PUT /api/experience/:title/:company/:startedFrom  
 * @desc Finds user experience based on query parameters and updates the particular experience based on req.body contents
 * @access Private
 */
router.put('/:username/:title/:company/:startedFrom', [auth, authorization], async (req, res) => {
   const user = req.user._id
   req.body.user = user

   const searchQuery = await Experience.findOne({
      $and: [{
         user: mongoose.Types.ObjectId(user)
      }, {
         experience: {
            $elemMatch: {
               title: req.params.title,
               company: req.params.company,
               startedFrom: new Date(req.params.startedFrom)
            }
         }
      }]
   })

   if (!searchQuery) return res.status(400).send("Experience doesn\'t exist")

   const {
      error
   } = validate(req.body)
   if (error) return res.status(400).send(error.details[0].message)

   const {
      title,
      company,
      location,
      startedFrom,
      to,
      current,
      description
   } = req.body

   let experience

   const updatedExperience = {
      title,
      company,
      location,
      startedFrom,
      to,
      current,
      description
   }

   experience = await Experience.findOneAndUpdate({
      user: mongoose.Types.ObjectId(user),
      experience: {
         $elemMatch: {
            title: req.params.title,
            company: req.params.company,
            startedFrom: new Date(req.params.startedFrom)
         }
      }
   }, {
      $set: {
         'experience.$': updatedExperience
      }
   }, {
      new: true
   })

   try {
      experience = await experience.save()

      res.send(experience)
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
      }
   }
})

/*
 * @route DELETE /api/experience/:title/:company/:startedFrom  
 * @desc Finds user experience based on query parameters and deletes the particular experience
 * @access Private
 */
router.delete('/:username/:title/:company/:startedFrom', [auth, authorization], async (req, res) => {
   const user = req.user._id
   req.body.user = user

   const searchQuery = await Experience.findOne({
      $and: [{
         user: mongoose.Types.ObjectId(user)
      }, {
         experience: {
            $elemMatch: {
               title: req.params.title,
               company: req.params.company,
               startedFrom: new Date(req.params.startedFrom)
            }
         }
      }]
   })

   if (!searchQuery) return res.status(400).send("Experience doesn\'t exist")


   await Experience.updateOne({
      user: mongoose.Types.ObjectId(user),
      experience: {
         $elemMatch: {
            title: req.params.title,
            company: req.params.company,
            startedFrom: new Date(req.params.startedFrom)
         }
      }
   }, {
      $pull: {
         experience: {
            title: req.params.title,
            company: req.params.company,
            startedFrom: new Date(req.params.startedFrom)
         }
      }
   })


   try {
      res.send('deleted successfully')
      let experience = await Experience.findOne({
         user
      })

      experience = experience.experience

      if (experience.length === 0) await Experience.findOneAndRemove({
         user
      })
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
      }
   }
})

module.exports = router