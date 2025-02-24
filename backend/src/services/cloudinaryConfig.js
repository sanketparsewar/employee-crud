const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for in-memory storage
// Uses multer.memoryStorage() instead of diskStorage(), meaning the uploaded file is not saved on the server.
// Instead, the file is stored in RAM (buffer) temporarily.
// upload is the middleware that will handle single file uploads.
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) =>
    streamifier
      .createReadStream(buffer)
      .pipe(
        cloudinary.uploader.upload_stream(options, (error, result) =>
          error ? reject(error) : resolve(result)
        )
      )
  );

module.exports = { upload, uploadToCloudinary };
