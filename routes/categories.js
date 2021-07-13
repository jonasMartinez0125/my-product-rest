const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const {
    createCategory,
    obtainsCategories,
    obtainsCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories.controller');

const { existsCategoryPerId } = require('../helpers');

const router = Router();

// obtains all categories - public
router.get('/', obtainsCategories);

// obtains a category by id - public
router.get('/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsCategoryPerId),
    validateFields
], obtainsCategory);

// create category - private with token valid
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], createCategory);

// update category - private with token valid
router.put('/:id', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('id').custom(existsCategoryPerId),
    validateFields
], updateCategory);

// delete category - private just ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsCategoryPerId),
    validateFields
], deleteCategory);

module.exports = router;