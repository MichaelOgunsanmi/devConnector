const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')

module.exports = function (router, Experience) {
   /*
 * @route GET /api/experience/me?username=usernameValue
 * @desc Returns experience details about current user
 * @access Private
 */
router.get('/me', [auth, authorization], async (req, res) => {
    if (req.query.username === '%') return res.status(400).send('Input apporpriate Username')
 
    const experience = await Experience.findOne({
       user: req.user._id
    }).populate('user', ['name', 'avatar'])
 
    if (!experience) return res.status(404).send(`No experience exists for ${req.user.name}`)
 
    res.send(experience)
 }) 
}