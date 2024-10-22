const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Use the Cloudinary configuration
  params: {
    folder: "products", // Folder name in Cloudinary where images will be stored
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file formats
  },
});

// Create Multer instance using Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
