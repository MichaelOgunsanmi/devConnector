const express = require('express')

const users = require('../routes/users/_users')
const profile = require('../routes/profiles/_profiles')
const experience = require('../routes/experience/_experience')
const education = require('../routes/education/_education')
// const posts = require('../routes/posts/_posts')


const error = require('../middleware/error')


module.exports = function (app) {
   app.use(express.json()),
   app.use('/api/users', users),
   app.use('/api/profile', profile),
   app.use('/api/experience', experience),
   app.use('/api/education', education)
//   // app.use('/api/posts', posts),
   app.use(error)
}