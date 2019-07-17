const express = require('express')
const app = express()
const winston = require('winston')

require('./startup/config')()
require('./startup/logging')()
require('./startup/validation')()
require('./startup/routes')(app)
require('./startup/db')()



const port = process.env.PORT || 5000 || 3300

const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`)
})

module.exports = server