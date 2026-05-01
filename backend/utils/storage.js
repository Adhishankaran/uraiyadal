const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

let storage;

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
                              process.env.CLOUDINARY_API_SECRET &&
                              process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
    console.log('Using Cloudinary Storage');
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'chat_app',
            resource_type: 'auto'
        }
    });
} else {
    console.log('Using Local Fallback Storage');
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
}

const upload = multer({ storage: storage });

module.exports = { upload, isCloudinaryConfigured };
