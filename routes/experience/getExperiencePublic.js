const { Profile } = require('../../models/Profile')

module.exports = function (router, Experience) {
    /*
 * @route GET /api/experience/username
 * @desc Returns experience details about username
 * @access Public
 */
router.get('/:username', async (req, res) => {
    let user = await Profile.findOne({
       username: req.params.username
    })
    user = user.user
 
    const experience = await Experience.findOne({
       user
    }).populate('user', ['name', 'avatar'])
    if (!experience) return res.status(404).send(`No experience exists for ${req.params.username}`)
 
    res.send(experience)
 })
}