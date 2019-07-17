const mongoose = require('mongoose')

const auth = require('../../middleware/auth')
const authorization = require('../../middleware/authorization')


module.exports = function (router, Education, validate) {
    /*
     * @route POST /api/education/:username 
     * @desc Creates user education with no prior education or add new education to education list based on response from input fields
     * @access Private
     */
    router.post('/:username', [auth, authorization], async (req, res) => {
        const user = req.user._id
        req.body.user = user

        const {
            error
        } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const {
            school,
            degree,
            fieldOfStudy,
            startedFrom,
            to,
            current,
            description
        } = req.body

        const findDuplicate = await Education.findOne({
            $and: [{
                user: mongoose.Types.ObjectId(user)
            }, {
                education: {
                    $elemMatch: {
                        school,
                        degree,
                        fieldOfStudy,
                        startedFrom
                    }
                }
            }]
        })

        if (findDuplicate) return res.status(400).send('Education already added.')

        let education

        education = {
            school,
            degree,
            fieldOfStudy,
            startedFrom,
            to,
            current,
            description
        }

        const findUser = await Education.findOne({
            user
        })
        if (!findUser) {
            educationArray = []

            educationArray.push(education)

            education = new Education({
                user,
                education: educationArray
            })
        } else {
            education = await Education.findOneAndUpdate({
                user
            }, {
                $push: {
                    education
                }
            }, {
                new: true
            })
        }

        try {
            education = await education.save()

            res.send(education)
        } catch (error) {
            for (const field in error.errors) {
                console.log(error.errors[field].message);

                res.send(error.errors[field].message)
            }
        }
    })
}