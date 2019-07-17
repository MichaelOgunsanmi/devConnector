const mongoose = require('mongoose')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Experience) {
    /*
 * @route DELETE /api/experience/:username/:title/:company/:startedFrom  
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
}