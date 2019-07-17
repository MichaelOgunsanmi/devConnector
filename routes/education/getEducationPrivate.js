const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Education) {
  /*
 * @route GET /api/education/me?username=usernameValue
 * @desc Returns education details about current user
 * @access Private
 */
router.get('/me', [auth, authorization], async (req, res) => {
    if (req.query.username === '%') return res.status(400).send('Input apporpriate Username')
 
    const education = await Education.findOne({
       user: req.user._id
    }).populate('user', ['name', 'avatar'])
    if (!education) return res.status(404).send(`No education exists for ${req.user.name}`)
 
    res.send(education)
 })  
}