const express = require('express')
const router = express.Router()


const { Education, validate } = require('../../models/Education')


require('./getAllEducations')(router, Education)
require('./getEducationPublic')(router, Education)
require('./getEducationPrivate')(router, Education)
require('./createEducation')(router, Education, validate)
require('./updateEducation')(router, Education, validate)
require('./deleteEducation')(router, Education)


module.exports = router

/*
@TODO 
Write Documentation in a .md file of how routes work
*/