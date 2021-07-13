const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            errors: 'There is no token in the request'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETKEY);

        const user = await User.findById(uid);

        if(!user) {
            return res.status(401).json({
                errors: 'Token is not valid'
            });
        }

        if(!user.state) {
            return res.status(401).json({
                errors: 'Token is not valid'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        rest.status(401).json({
            errors: 'Token is not valid'
        });
    }
}

module.exports = {
    validateJWT
}