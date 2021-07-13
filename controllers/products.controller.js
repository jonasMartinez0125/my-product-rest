const { response } = require('express');
const { Product } = require('../models');

const createProduct = async (req, res = response ) => {
    const { state, user, ...body } = req.body;
    
    try {
        const productDB = await Product.findOne({ name: body.name });

        if(productDB) {
            return res.status(400).json({
                errors: 'Product ${productDB.name}, is already exists'
            });
        }

        // generate data
        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id
        }

        const product = new Product(data);

        // save database
        await product.save();

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

const obtainsProducts = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    try {
        const [ total, products ] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('user', 'name')
                .populate('category', 'name')
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            total,
            products
        });
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }

}

const obtainsProduct = async (req, res = response ) => {
    const { id }= req.params;

    try {
        const product = await Product.findById(id)
                                .populate('user', 'name')
                                .populate('category', 'name');

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

const updateProduct = async ( req, res = response ) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if(data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    try {
        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    try {
        const productDeleted = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

        res.status(200).json({
            product: productDeleted
        });

    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

module.exports = {
    createProduct,
    obtainsProducts,
    obtainsProduct,
    updateProduct,
    deleteProduct
}