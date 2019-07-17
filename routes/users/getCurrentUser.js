const auth = require('../../middleware/auth')

module.exports = function (router, User) {
    /*
 * @route GET /api/users/me
 * @desc Returns details about current user. Only user details yjough. No profile or education details can be accessed through this route
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
 })
}