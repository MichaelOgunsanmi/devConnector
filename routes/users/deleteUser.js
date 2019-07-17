const mongoose = require('mongoose')


const { Profile } = require('../../models/Profile')
const { Experience } = require('../../models/Experience')
const { Education } = require('../../models/Education')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, User) {
    router.delete('/me', [auth, authorization], async (req, res) => {
        let user = req.user._id
        const username = req.query.username
     
        const session = await mongoose.startSession()
        session.startTransaction()
     
        try {
           user = user = await User.findByIdAndRemove(user)
     
           let profile = await Profile.findOneAndRemove({
              username
           })
     
           let experience = await Experience.findOneAndRemove({
              user
           })
     
           let education = await Education.findOneAndRemove({
              user
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
}