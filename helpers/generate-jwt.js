const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETKEY, {
            expiresIn: '3h'
        }, (err, token) => {
            if(err) {
                reject('Token cannot be generated');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}