// middlewares/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "DevTinder",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `user-${Date.now()}`,
    resource_type: "image", // ✅ important for image uploads
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit
});

module.exports = upload;
