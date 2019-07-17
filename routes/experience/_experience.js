const express = require('express')
const router = express.Router()


const { Experience, validate } = require('../../models/Experience')


require('./getAllExperiences')(router, Experience)
require('./getExperiencePublic')(router, Experience)
require('./getExperiencePrivate')(router, Experience)
require('./createExperience')(router, Experience, validate)
require('./updateExperience')(router, Experience, validate)
require('./deleteExperience')(router, Experience)


module.exports = router

/*
@TODO 
Write Documentation in a .md file of how routes work
*/