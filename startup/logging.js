const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')
const config = require('config')


const winstonSetting = (filename) => {
    return {
        filename,
        format: winston.format.combine(
            winston.format.timestamp({
                format:'YYYY-MM-DD HH:mm:ss' 
            }),
            winston.format.simple()
        )
    }
}

const dbConnection = () => {
    dbLocal = config.get('dbLocal')
 //   dbAtlas = config.get('dbAtlas')
    db = dbLocal //|| dbAtlas

    return {
        db,
        name: "logFile"
    }
}



module.exports = function () {
    process.on('unhandledRejections', (ex) => {
        throw(ex) 
     })

    winston.exceptions.handle(
        new winston.transports.File(
            winstonSetting('uncaughtExceptions.log')
        )
    )

    winston.add(
        new winston.transports.File(
            winstonSetting('logfile.log') 
        )
    )
    
    winston.add(
        new winston.transports.MongoDB(
            dbConnection()
        )
    )
    
    winston.add(
        new winston.transports.Console({
                format: winston.format.simple()
            })
    )

}

/* 
express-async-errors involves handling erors and logging these errors. 
That is why it is required here 
winston-mongodb is used for logging to mongodb
but commented out for testing purposes
*/