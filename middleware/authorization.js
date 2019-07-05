const mongoose = require('mongoose')

const {
    Profile
} = require('../models/Profile')

module.exports = async function (req, res, next) {
    const user = req.user._id
    const username = req.params.username || req.query.username || '%'

    profile = await Profile.findOne({
        user
    })
    username = profile.username

    if (username === '%') return next()

    const profile = await Profile.findOne({
        username
    })

    if (!profile) return res.status(404).send(`No profile exists for ${username}, create profile instead`)

    if (mongoose.Types.ObjectId(user).toHexString() !== profile.user.toHexString()) return res.status(403).send('You are not allowed to perform this operation. Invalid token provided')

    next()
}