const express = require('express')
const router = express.Router()


const { Profile, validate } = require('../../models/Profile')


require('./getAllProfiles')(router, Profile)
require('./getProfilePublic')(router, Profile)
require('./getProfilePrivate')(router, Profile)
require('./createProfile')(router, Profile, validate)
require('./updateProfile')(router, Profile, validate)
require('./deleteProfile')(router, Profile)


module.exports = router

/*
@TODO 
Write Documentation in a .md file of how routes work
*/