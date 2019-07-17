module.exports = function (router, Profile) {
    /*
     * @route GET /api/profile/all
     * @desc Returns profile details about all users with profiles
     * @access Public
     */
    router.get('/all', async (req, res) => {
        const profiles = await Profile
            .find({})
            .populate('user', ['name', 'avatar'])

        if (profiles.length === 0) return res.status(404).send('No profiles exists')

        res.send(profiles)
    })
}