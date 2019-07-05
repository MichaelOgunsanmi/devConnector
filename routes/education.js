const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {
   Education,
   validate
} = require('../models/Education')
const {
   Profile
} = require('../models/Profile')

const auth = require('../middleware/auth')
const authorization = require('../middleware/authorization')

/*
 * @route GET /api/education/me?username=usernameValue
 * @desc Returns education details about current user
 * @access Private
 */
router.get('/me', [auth, authorization], async (req, res) => {

   const education = await Education.findOne({
      user: req.user._id
   }).populate('user', ['name', 'avatar'])
   if (!education) return res.status(404).send(`No education exists for ${req.user.name}`)

   res.send(education)
})

/*
 * @route GET /api/education/all
 * @desc Returns education details about all users with education
 * @access Public
 */
router.get('/all', async (req, res) => {
   const education = await Education
      .find({})
      .populate('user', ['name', 'avatar'])

   if (education.length === 0) return res.status(404).send('No education exists')

   res.send(education)
})

/*
 * @route GET /api/education/username
 * @desc Returns education details about username
 * @access Public
 */
router.get('/:username', async (req, res) => {
   let user = await Profile.findOne({
      username: req.params.username
   })
   user = user.user

   const education = await Education.findOne({
      user
   }).populate('user', ['name', 'avatar'])
   if (!education) return res.status(404).send(`No education exists for ${req.params.username}`)

   res.send(education)
})

/*
 * @route POST /api/education/  
 * @desc Creates user education with no prior education or add new education to education list based on response from input fields
 * @access Private
 */
router.post('/', auth, async (req, res) => {
   const user = req.user._id
   req.body.user = user

   const {
      error
   } = validate(req.body)
   if (error) return res.status(400).send(error.details[0].message)

   const {
      school,
      degree,
      fieldOfStudy,
      startedFrom,
      to,
      current,
      description
   } = req.body

   const findDuplicate = await Education.findOne({
      $and: [{
         user: mongoose.Types.ObjectId(user)
      }, {
         education: {
            $elemMatch: {
               school,
               degree,
               fieldOfStudy,
               startedFrom
            }
         }
      }]
   })

   if (findDuplicate) return res.status(400).send('Education already added.')

   let education

   education = {
      school,
      degree,
      fieldOfStudy,
      startedFrom,
      to,
      current,
      description
   }

   const findUser = await Education.findOne({
      user
   })
   if (!findUser) {
      educationArray = []

      educationArray.push(education)

      education = new Education({
         user,
         education: educationArray
      })
   } else {
      education = await Education.findOneAndUpdate({
         user
      }, {
         $push: {
            education
         }
      }, {
         new: true
      })
   }

   try {
      education = await education.save()

      res.send(education)
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);

         res.send(error.errors[field].message)
      }
   }
})

/*
 * @route PUT /api/education/:school/:fieldOfStudy/:startedFrom  
 * @desc Finds user education based on query parameters and updates the particular education based on req.body contents
 * @access Private
 */
router.put('/:username/:school/:fieldOfStudy/:degree/:startedFrom', [auth, authorization], async (req, res) => {
   const user = req.user._id
   req.body.user = user

   const searchQuery = await Education.findOne({
      $and: [{
         user: mongoose.Types.ObjectId(user)
      }, {
         education: {
            $elemMatch: {
               school: req.params.school,
               fieldOfStudy: req.params.fieldOfStudy,
               degree: req.params.degree,
               startedFrom: new Date(req.params.startedFrom)
            }
         }
      }]
   })

   if (!searchQuery) return res.status(400).send("Education doesn\'t exist")

   const {
      error
   } = validate(req.body)
   if (error) return res.status(400).send(error.details[0].message)

   const {
      school,
      degree,
      fieldOfStudy,
      startedFrom,
      to,
      current,
      description
   } = req.body

   let education

   const updatedEducation = {
      school,
      degree,
      fieldOfStudy,
      startedFrom,
      to,
      current,
      description
   }

   education = await Education.findOneAndUpdate({
      user: mongoose.Types.ObjectId(user),
      education: {
         $elemMatch: {
            school: req.params.school,
            fieldOfStudy: req.params.fieldOfStudy,
            startedFrom: new Date(req.params.startedFrom)
         }
      }
   }, {
      $set: {
         'education.$': updatedEducation
      }
   }, {
      new: true
   })

   try {
      education = await education.save()

      res.send(education)
   } catch (error) {
      for (const field in error.errors) {
         console.log(error.errors[field].message);
         res.send(error.errors[field].message)
      }
   }
})

/*
 * @route DELETE /api/education/:username/:school/:fieldOfStudy/:degree/:startedFrom  
 * @desc Finds user education based on query parameters and deletes the particular education
 * @access Private
 */
router.delete('/:username/:school/:fieldOfStudy/:degree/:startedFrom', [auth, authorization], async (req, res) => {
   const user = req.user._id
   req.body.user = user

   const searchQuery = await Education.findOne({
      $and: [{
         user: mongoose.Types.ObjectId(user)
      }, {
         education: {
            $elemMatch: {
               school: req.params.school,
               fieldOfStudy: req.params.fieldOfStudy,
               degree: req.params.degree,
               startedFrom: new Date(req.params.startedFrom)
            }
         }
      }]
   })

   if (!searchQuery) return res.status(400).send("Education doesn\'t exist")

   await Education.updateOne({
      user: mongoose.Types.ObjectId(user),
      education: {
         $elemMatch: {
            school: req.params.school,
            fieldOfStudy: req.params.fieldOfStudy,
            degree: req.params.degree,
            startedFrom: new Date(req.params.startedFrom)
         }
      }
   }, {
      $pull: {
         education: {
            school: req.params.school,
            fieldOfStudy: req.params.fieldOfStudy,
            degree: req.params.degree,
            startedFrom: new Date(req.params.startedFrom)
         }
      }
   })

   try {
      res.send('deleted successfully')
      let education = await Education.findOne({
         user
      })

      education = education.education

      if (education.length === 0) await Education.findOneAndRemove({
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