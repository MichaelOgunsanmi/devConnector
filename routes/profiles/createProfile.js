const mongoose = require('mongoose')

const { User } = require('../../models/User')

const auth = require('../../middleware/auth')


module.exports = function (router, Profile, validate) {
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
 
}