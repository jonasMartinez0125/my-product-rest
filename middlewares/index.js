const validateFields = require('../middlewares/validate-fields');
const validateRoles = require('../middlewares/validate-role');
const validateJWT = require('../middlewares/validate-jwt');
const validateFileUpload = require('../middlewares/validate-files');

module.exports = {
    ...validateFields,
    ...validateRoles,
    ...validateJWT,
    ...validateFileUpload
}