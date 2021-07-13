const {
    Role,
    User,
    Category,
    Product
} = require('../models');

/* USERS */
const existsMail = async (mail = '') => {
    // ckeck if mail exists
    const existsMail = await User.findOne({ mail });

    if(existsMail) {
        throw new Error(`Mail: ${mail}, is already registered`);
    }
}

const existsUserPerId = async (id) => {
    // check if mail exists
    const existsUser = await User.findById(id);
    if(!existsUser) {
        throw new Error(`Id does not exist ${id}`);
    }
}

const isRoleValid = async (role = '') => {
    const existsRole = await Role.findOne({role});

    if(!existsRole) {
        throw new Error(`Role ${role} is not registered on database`);
    }
}

/*Categories*/
const existsCategoryPerId = async(id) => {
    // check if mail exists
    const existsCategory = await Category.findById(id);
    if(!existsCategory) {
        throw new Error(`Id is not exists ${id}`);
    }
}

/*Products*/
const existsProductPerId = async(id) => {
    const existsProduct = await Product.findById(id);
    if(!existsProduct) {
        throw new Error(`Id is not exists ${id}`);
    }
}

/* Validate collections allowed*/
const collectionsAllowed = (collection = '', collections = []) => {
    const included = collections.includes(collection);
    if(!included) {
        throw new Error(`Collection ${collection} is not allowed, ${collections}`);
    }

    return true;
}

module.exports = {
    existsMail,
    existsUserPerId,
    isRoleValid,
    existsCategoryPerId,
    existsProductPerId,
    collectionsAllowed
}