const { response } = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

const { generateJWT, googleVerify } = require('../helpers');

const login = async (req, res = response) => {
    const { mail, password } = req.body;

    try {
        // check if mail exists
        const user = await User.findOne({ mail });
        
        if(!user) {
            return res.status(400).json({
                errors: 'User or Password are not correct'
            });
        }

        // if user is available
        if(!user.state) {
            return res.status(400).json({
                errors: 'User or Password are not correct'
            });
        }

        // verify password
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                errors: 'User or Password are not correct'
            });
        }

        console.log(user.id);
        // generate json web token
        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token
        });

    } catch (error) {
        res.status(500).json({
            errors: 'There was an error'
        });
    }
}

const googleSignin = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { mail, name, image } = await googleVerify(id_token);

        let user = await User.findOne({ mail });

        if(!user) {
            const data = {
                name,
                mail,
                password: '******',
                image,
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // if user on database
        if(!user.state) {
            return res.status(401).json({
                errors: 'There was an error'
            })
        }

        // generate JWT
        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            errors: 'There was an error. Google token is not valid'
        });
    }
}

module.exports = {
    login,
    googleSignin
}