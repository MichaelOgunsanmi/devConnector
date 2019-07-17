const { Profile } = require('../../models/Profile')


module.exports = function (router, Education) {
    /*
 * @route GET /api/education/username
 * @desc Returns education details about username
 * @access Public
 */
router.get('/:username', async (req, res) => {
    let user = await Profile.findOne({
       username: req.params.username
    })
    user = user.user
 
    const education = await Education.findOne({
       user
    }).populate('user', ['name', 'avatar'])
    if (!education) return res.status(404).send(`No education exists for ${req.params.username}`)
 
    res.send(education)
 })
}