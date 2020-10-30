const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('config');
//cloudinary config
cloudinary.config({
  cloud_name: config.get('cloudinary.cloud_name'),
  api_key: config.get('cloudinary.api_key'),
  api_secret: config.get('cloudinary.api_secret')
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.API_FOLDER_NAME || 'temp',
    format: async (req, file) => file.originalname.split('.')[1],
    public_id: (req, file) => file.public_id
  }
});

module.exports = cloudinaryStorage;
