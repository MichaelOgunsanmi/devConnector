const express = require('express')
const register = require('../routes/registration')
const posts = require('../routes/posts')
const profile = require('../routes/profile')
const users = require('../routes/users')
const login = require('../routes/login')
const experience = require('../routes/experience')
const education = require('../routes/education')
const error = require('../middleware/error')


module.exports = function (app) {
   app.use(express.json()),
   app.use('/api/register', register),
   app.use('/api/login', login),
   app.use('/api/posts', posts),
   app.use('/api/profile', profile),
   app.use('/api/users', users),
   app.use('/api/experience', experience),
   app.use('/api/education', education)
   app.use(error)
}