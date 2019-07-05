const winston = require('winston')
const mongoose = require('mongoose')
const config = require('config')

const dbConnection = async () => {
    dbLocal = config.get('dbLocal')
    dbAtlas = config.get('dbAtlas')

    mongoose.set('useNewUrlParser', true)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useFindAndModify', false)

    try {
        // const atlasConnection = await mongoose.connect(dbAtlas)
        const localDbConnection = await mongoose.connect(dbLocal)

        // if (atlasConnection) winston.info(`Connected to Mongo Atlas...`) 

        if (localDbConnection) winston.info(`Connected to Local MongoDB...`)

    } catch (error) {
        winston.info(error.message)
        process.exit(1)
    }
}


module.exports = dbConnection