const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const collectionsAllowed = [
    'user',
    'categories',
    'products',
    'roles'
];

const searchUsers = async(word = '', res = response) => {
    const isMongoId = ObjectId.isValid(word);

    if(isMongoId) {
        const user = await User.findById(word);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(word, 'i');
    const users = await User.find({
        $or:[{ name: regex }, { mail: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: users
    });
}

const searchCategories = async (word = '', res = response) => {
    const isMongoId = ObjectId.isValid(word);

    if(isMongoId) {
        const category = await Category.findById(word);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(word, 'i');
    const categories = await Category.find({ name: regex, state: true });

    res.json({
        results: categories
    });
}

const searchProducts = async (word = '', res = response) => {
    const isMongoId = ObjectId.isValid(word);

    if(isMongoId) {
        const product = await Product.findById(word)
                                .populate('category', 'name');

        return res.status(200).json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(word, i);
    const products = await Product.find({ name: regex, state: true })
                                .populate('category', 'name');
    
    res.status(200).json({
        results: products
    });
}

const search = (req, res = response) => {
    const { collection, word } = req.params;

    if(!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            errors: `Collections allowed are: ${collectionsAllowed}`
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(word, res);
            break;
        case 'category':
            searchCategories(word, res);
            break;
        case 'products':
            searchProducts(word, res);
            break;
        default:
            return res.status(500).json({
                errors: 'There was an error'
            });
    }
}

module.exports = {
    search
}