const express = require("express");
const router = express.Router();
const { upload } = require("../services/cloudinaryConfig");
const { uploadImage } = require("../controllers/cloudinary.controller");

// upload is middleware that handles single file uploading
router.post("/", upload.single("file"), uploadImage);

module.exports = router;