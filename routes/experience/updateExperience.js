const mongoose = require('mongoose')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Experience, validate) {
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
    
}