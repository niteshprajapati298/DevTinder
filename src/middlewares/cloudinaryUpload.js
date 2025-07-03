const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // adjust the path if needed

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DevTinder",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `user-${Date.now()}`,
  },
});

const upload = multer({ storage });

module.exports = upload;
