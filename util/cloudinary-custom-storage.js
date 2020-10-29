const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('config');
//cloudinary config
cloudinary.config({
  cloud_name: config.get('cloudinary.CLOUD_NAME'),
  api_key: config.get('cloudinary.API_KEY'),
  api_secret: config.get('cloudinary.API_SECRET')
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
