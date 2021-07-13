const { response } = require('express');
const { fileUploader } = require('../helpers');
const path = require('path');
const fs = require('fs');
const { User, Product } = require('../models');

const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const loadFile = async (req, res = response) => {

    try {
        const name = await fileUploader(req.files, undefined, 'imgs');
        res.status(200).json({name});
    } catch (error) {
        res.status(400).json({
            errors: error
        });
    }
}

const updateFile = async(req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch(collection) {
        case 'users':
            model = await User.findById(id);
            if(!model) {
                return res.status(400).json({
                    errors: `There is no user with the id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model) {
                return res.status(400).json({
                    errors: `There is no product with the id ${id}`
                });
            }
            break;
        default: 
            return res.status(500).json({
                errors: 'There was an error'
            });
    }

    // clean preview images
    if(model.image) {
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);
        if(fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const name = await fileUploader(req.files, undefined, collection);
    model.image = name;

    await model.save();

    res.status(200).json(model);
}
const updateFileCloudinary = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model) {
                return res.status(400).json({
                    errors: `There is no user with the id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model) {
                return res.status(400).json({
                    errors: `There is no product with the id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                errors: 'There was an error'
            });
    }

    if(model.image) {
        const nameArr = model.image.split('/');
        const name = nameArr[nameArr.lenght - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.image;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.image = secure_url;

    await model.save();

    res.status(200).json(model);
}

const showImage = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch(collection) {
       case 'users':
           model = await User.findById(id);
           if(!model) {
               return res.status(400).json({
                   errors: `There is no user with the id ${id}`
               });
           }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model) {
                return res.status(400).json({
                    errors: `There is no product with the id ${id}`
                });
            }
            break;
        default: 
            return res.status(500).json({
                errors: 'There was an error'
            });
    }

    if(model.image) {
        return res.sendFile(imagePath);
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);
        if(fs.existsSync(imagePath)) {
        }
    }
    const imagePath = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(imagePath);
}

module.exports = {
    loadFile,
    updateFile,
    showImage,
    updateFileCloudinary
}