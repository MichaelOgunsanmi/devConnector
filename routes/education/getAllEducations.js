module.exports = function (router, Education) {
    /*
 * @route GET /api/education/all
 * @desc Returns education details about all users with education
 * @access Public
 */
router.get('/all', async (req, res) => {
    const education = await Education
       .find({})
       .populate('user', ['name', 'avatar'])
 
    if (education.length === 0) return res.status(404).send('No education exists')
 
    res.send(education)
 })
}