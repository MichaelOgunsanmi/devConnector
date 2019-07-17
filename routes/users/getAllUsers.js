module.exports = function (router, User) {
    /*
 * @route GET /api/users/all
 * @desc Returns profile details about all users with profiles
 * @access Public
 */
router.get('/all', async (req, res) => {
    const users = await User.find({})
 
    if (users.length === 0) return res.status(404).send('No users exists')
 
    res.send(users)
 })
}