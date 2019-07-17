const mongoose = require('mongoose')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Experience, validate) {
   /*
 * @route POST /api/experience/username  
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
}