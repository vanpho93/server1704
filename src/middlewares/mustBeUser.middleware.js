const { verify } = require('../helpers/jwt');

async function mustBeUser(req, res, next) {
    try {
        const { token } = req.headers;
        const { _id } = await verify(token);
        req.idUser = _id;
        next();
    } catch (error) {
        res.status(400).send({ success: false, message: 'INVALID_TOKEN' });
    }
}

module.exports = { mustBeUser };
