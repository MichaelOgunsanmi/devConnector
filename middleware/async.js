module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res)
        } catch (ex) {
            next(ex)
        }
    }
}

/* this is used to wrap our route functions in the event 
that express-async-errors doesn't work as expected. 
hey wrap our routes in try catch blocks. 
An implementation needed for async await code base. 
The express-async-errors wrap our code in an imlementation 
similar to the one above for asyncMiddleware

sample implementation gives: 

const asyncMiddleware = require('../middleware/async')

router.get('/',  asyncMiddleware( async (req, res) => {
    const education = await Education.find().sort('school')
    res.send(educationgenres) 
}))
*/