const mongoose = require('mongoose')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Education, validate) {
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
}