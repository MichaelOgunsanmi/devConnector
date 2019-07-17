const mongoose = require('mongoose')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Education) {
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
}