const winston = require('winston')

module.exports = function (err, req, res, next) {
   winston.error(err.message, err) 

   res.status(500).send('Something went wrong with the server')
}

/*catches any error in the request-processing pipeline 
and uses winston to log these errors 
*/