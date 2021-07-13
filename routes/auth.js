const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');

const { login, googleSignin } = require('../controllers/auth.controller');

const router = Router();

router.post('/login', [
    check('mail', 'Mail or Password is required').isEmail(),
    check('password', 'Mail or Password is required').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'ID token is required').not().isEmpty(),
    validateFields
], googleSignin);

module.exports = router;