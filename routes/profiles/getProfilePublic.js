module.exports = function (router, Profile) {
    /*
     * @route GET /api/profile/username
     * @desc Returns profile details about username
     * @access Public
     */
    router.get('/:username', async (req, res) => {
        const profile = await Profile.findOne({
            username: req.params.username
        }).populate('user', ['name', 'avatar'])
        if (!profile) return res.status(404).send(`No profile exists for ${req.params.username}`)

        res.send(profile)
    })
}