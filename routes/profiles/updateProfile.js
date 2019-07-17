const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')

module.exports = function (router, Profile, validate) {
    /* 
 * @route PUT /api/profile/username 
 * @desc Updates profile based on response from input fields
 * @access Private
 */

router.put('/:username', [auth, authorization], async (req, res) => {
    const user = req.user._id
    req.body.user = user
 
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
 
    let profile = await Profile.findOneAndUpdate({
       username: req.params.username
    }, {
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
    }, {
       new: true
    })
 
    try {
  
       profile = await profile.save()
 
       res.send(profile)
    } catch (error) {
       for (const field in error.errors) {
          console.log(error.errors[field].message);
          res.send(error.errors[field].message)
       }
    }
 })
 
}