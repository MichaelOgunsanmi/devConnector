const express = require('express')
const router = express.Router()


const { User, validate } = require('../../models/User')


require('./getAllUsers')(router, User)
require('./getCurrentUser')(router, User)
require('./registerUser')(router, User, validate)
require('./login')(router, User)
require('./deleteUser')(router, User)



module.exports = router

/*
@TODO 
Write Documentation in a .md file of how routes work
*/