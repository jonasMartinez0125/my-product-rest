const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const fileUploader = require('./file-uploader');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...fileUploader
}