const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateJWT,
    validateFields,
    isAdminRole
} = require('../middlewares');

const {
    createProduct,
    obtainsProduct,
    obtainsProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

const { existsCategoryPerId, existsProductPerId } = require('../helpers/db-validators');

const router = Router();

// obtains all products - public
router.get('/', obtainsProducts);

// obtains one product by id - public
router.get('/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsProductPerId)
], obtainsProduct);

// create product - private with token valid
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Id is not valid').isMongoId(),
    check('category').custom(existsCategoryPerId),
    validateFields
], createProduct);

// update product - private with token valid
router.put('/:id', [
    validateJWT,
    check('id').custom(existsProductPerId),
    validateFields
], updateProduct);

// delete product - private just Administer role with token valid
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsProductPerId)
], deleteProduct);

module.exports = router;