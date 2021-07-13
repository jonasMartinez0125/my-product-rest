const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

// function to create a new user
const userPost = async (req, res = response) => {
    const { name, mail, password, role } = req.body;

    try {     
        const user = new User({ name, mail, password, role });
    
        // encrypt the password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
    
        // save to database
        await user.save();
    
        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }

}

// function to get users
const usersGet = async(req = request, res = response) => {

    const {  limit = 5, from = 0 } = req.body;
    const query = { state: true };

    try {
        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(from))
                .limit(Number(limit))
        ]);
    
        res.status(200).json({
            total,
            users
        });

    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }

}

// function to update one user
const userPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, mail, ...rest } = req.body;
    try {
        if(password) {
            // encrypt password
            const salt = bcrypt.genSaltSync();
            rest.password = bcrypt.hashSync(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, rest, {new: true});

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

// function to delete one user
const userDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true});

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

module.exports = {
    userPost,
    usersGet,
    userPut,
    userDelete
}