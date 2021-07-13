// imports
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// import database configuration
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.path = {
            auth: '/api/auth',
            search: '/api/search',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads'
        };

        // connect to database
        this.connectDB();

        // middlewares
        this.middlewares();
        
        // routes of the application
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // reading y parsing the body
        this.app.use(express.json());

        // public directory
        this.app.use(express.static('public'));

        // Fileupload - Upload files
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }) );
    }

    routes() {
        this.app.use(this.path.users, require('../routes/users'));
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.categories, require('../routes/categories'));
        this.app.use(this.path.products, require('../routes/products'));
        this.app.use(this.path.uploads, require('../routes/uploads'));
        this.app.use(this.path.search, require('../routes/search'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running in port', this.port);
        });
    }
}

module.exports = Server;