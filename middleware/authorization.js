const mongoose = require('mongoose')

const {
    Profile
} = require('../models/Profile')
const {
    User
} = require('../models/User')

module.exports = async function (req, res, next) {
    const user = req.user._id

    findUser = await User.findOne({
        _id: user
    })

    if (!findUser) return res.status(404).send('No User exists! Create a new user instead')

    if (findUser.hasProfile && ((req.params.username || req.query.username) === undefined)) return res.status(400).send('Request Parameters incomplete. Check and Update accordingly')

    const username = req.params.username || req.query.username || '%'

    if (username === '%') return next()

    const profile = await Profile.findOne({
        username
    })

 

    if (!profile) return res.status(404).send(`No profile exists for ${username}, create profile instead`)

    if (mongoose.Types.ObjectId(user).toHexString() !== profile.user.toHexString()) return res.status(403).send('You are not allowed to perform this operation. Invalid token provided')

    next()
}