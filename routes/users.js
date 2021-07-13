const { Router } = require('express');
const { check } = require('express-validator');

// helpers
const {
    existsMail,
    isRoleValid,
    existsUserPerId
} = require('../helpers');

// middlewares
const {
    validateFields,
    hasRole,
    validateJWT
} = require('../middlewares');

// controllers
const {
    userPost, usersGet, userPut, userDelete
} = require('../controllers/users.controller');

const router = Router();

// create an user
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({min: 6}),
    check('mail', 'Mail is not valid').isEmail(),
    check('mail').custom(existsMail),
    check('role').custom(isRoleValid),
    validateFields
], userPost );

// get all users with state true
router.get('/', usersGet);

// update an user
router.put('/:id', [
    check('id', 'it is not ID valid').isMongoId(),
    check('id').custom( existsUserPerId),
    check('role').custom(isRoleValid),
    validateFields
], userPut);

// delete an user
router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE', 'VENTAR_ROLE', 'OTRO_ROLE'),
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsUserPerId),
    validateFields
], userDelete); 

module.exports = router;