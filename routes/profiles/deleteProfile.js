const mongoose = require('mongoose')


const { Education } = require('../../models/Education')
const { Experience } = require('../../models/Experience')
const { User } = require('../../models/User')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')

module.exports = function (router, Profile) {
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
          user
       })
 
       const education = await Education.findOneAndRemove({
          user
       })

       await User.findOneAndUpdate({
         _id: mongoose.Types.ObjectId(user)
      }, {
         $set: {
            hasProfile: false
         }
      }, {
         new: true
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
 
}