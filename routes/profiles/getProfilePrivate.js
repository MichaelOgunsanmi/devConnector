const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')

module.exports = function (router, Profile) {
  /*
 * @route GET /api/profile/me?username=usernameValue
 * @desc Returns profile details about current user
 * @access Private
 */
router.get('/me', [ auth, authorization ], async(req, res) => {
    if (req.query.username === '%') return res.status(400).send('Input apporpriate Username')
    const profile = await Profile.findOne({user: req.user._id}).populate('user', ['name', 'avatar'])
    if (!profile) return res.status(404).send(`No profile exists for ${req.user.name}`) 

    res.send(profile)
 })  
}