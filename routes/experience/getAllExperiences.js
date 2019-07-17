module.exports = function (router, Experience) {
    /*
 * @route GET /api/experience/all
 * @desc Returns experience details about all users with experience
 * @access Public
 */
router.get('/all', async (req, res) => {
    const experience = await Experience
       .find({})
       .populate('user', ['name', 'avatar'])
 
    if (experience.length === 0) return res.status(404).send('No experience exists')
 
    res.send(experience)
 })
}