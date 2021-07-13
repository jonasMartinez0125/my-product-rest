const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFileUpload } = require('../middlewares');
const {
    loadFile,
    showImage,
    updateFileCloudinary
} = require('../controllers/uploads.controller');
const { collectionsAllowed } = require('../helpers');

const router = Router();

router.post('/', validateFileUpload, loadFile);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom(c => collectionsAllowed(c, ['users', 'products'])),
    validateFields
], updateFileCloudinary);

router.get('/:collection/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom( c => collectionsAllowed(c, ['users',  'products'])),
    validateFields
], showImage);

module.exports = router;