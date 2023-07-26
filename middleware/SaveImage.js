const fs = require('fs').promises;

const saveImg = async (base64Data,id) => {
    // console.log('base');

    try {
        const base64Image = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        const uniqueFileName = id || `${randomUUID()}` + ".jpg";
        const filePath = `${__dirname}/../public/images/${uniqueFileName}`;

        await fs.writeFile(filePath, base64Image, 'base64');

        const staticPath = `/images/${uniqueFileName}`;
        return staticPath;
    } catch (error) {
        return Promise.reject(error);
    }

};

module.exports = saveImg;