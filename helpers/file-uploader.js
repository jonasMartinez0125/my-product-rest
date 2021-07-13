const path = require('path');
const { v4: uuidv4 } = require('uuid');

const fileUploader = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], directory = '') => {
    return new Promise( (resolve, reject) => {
        const { image } = files;
        const nameSplit = image.name.split('.');
        const extension = nameSplit[ nameSplit.length - 1];

        // validate the extension
        if(!validExtensions.includes(extension)) {
            return reject(`Extension ${extension} is not valid - ${validExtensions}`);
        }

        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', directory, nameTemp);

        image.mv(uploadPath, (err) => {
            if(err) {
                reject(err);
            }

            resolve(nameTemp);
        });
    });
}

module.exports = {
    fileUploader
}