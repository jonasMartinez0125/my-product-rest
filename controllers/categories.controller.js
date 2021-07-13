const { response } = require('express');
const { Category } = require('../models');

const createCategory = async (req, res = response) => {
    const name = req.body.name.toUpperCase();

    try {
        const categoryDB = await Category.findOne({ name });
        if(categoryDB) {
            return res.status(400).json({
                errors: `Category ${categoryDB.name}, is already exists`
            });
        }

        const data = {
            name,
            user: req.user._id
        };

        const category = new Category(data);

        await category.save();

        res.status(201).json(category);
        
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

const obtainsCategories = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.body;
    const query = { state: true };

    try {
        const [ total, categories ] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .populate('user', 'name')
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            total,
            categories
        });

    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }

}

const obtainsCategory = async (req, res = response) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id)
                                .populate('user', 'name');
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }

}

const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    try {
        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

const deleteCategory = async (req, res = response) => {
    const { id } =  req.params;

    try {
        const categoryDelete = await Category.findByIdAndUpdate(id, { state: false }, { new: true });

        res.status(200).json({
            category: categoryDelete
        });
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

module.exports = {
    createCategory,
    obtainsCategories,
    obtainsCategory,
    updateCategory,
    deleteCategory
}