const { uploadToCloudinary } = require("../services/cloudinaryConfig");

const uploadImage = async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "emp-crud",
    });
    res.json({
      message: "File uploaded successfully",
      file: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = { uploadImage };
