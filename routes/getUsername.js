module.exports = function (req, res) {
    if (req.query.username === '%') return res.status(400).send('Input apporpriate Username')
}