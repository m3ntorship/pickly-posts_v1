const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { resolve } = require("path");
dotenv.config({ path: resolve("secrets", ".env") });

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.API_FOLDER_NAME || "temp",
    format: async (req, file) => file.originalname.split(".")[1],
    public_id: (req, file) => file.public_id,
  },
});

module.exports = cloudinaryStorage;
