const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const upload = require("../middlewares/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");


profileRouter.get("/profile/view",userAuth, async (req, res) => {

    try {
        const user = req.user;
         res.send(user);
    } catch (error) {

        res.status(401).send("Invalid or expired token" , error.message);
    }
});


profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      console.log("📩 Incoming body:", req.body);
      console.log("📷 Uploaded file info:", req.file);

      const user = req.user;

      // Update editable fields
      const updateFields = ["firstName", "lastName", "age", "gender", "about", "skills"];
      updateFields.forEach((field) => {
        if (req.body[field]) {
          user[field] = req.body[field];
        }
      });

      // If a new photo is uploaded
      if (req.file && req.file.path) {
        // ✅ Safely delete old Cloudinary image
        if (user.cloudinaryId) {
          try {
            await cloudinary.uploader.destroy(user.cloudinaryId);
            console.log("🗑️ Old image deleted:", user.cloudinaryId);
          } catch (deleteErr) {
            console.warn("⚠️ Failed to delete old image:", deleteErr.message);
          }
        }

        // ✅ Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "DevTinder",
        });

        // ✅ Save new photo data
        user.photoUrl = result.secure_url;
        user.cloudinaryId = result.public_id;
        console.log("✅ New image uploaded:", result.public_id);
      }

      await user.save();

      res.json({
        message: `${user.firstName}, your profile was updated successfully.`,
        data: user,
      });
    } catch (err) {
      console.error("❌ Profile edit error:", err);
      res.status(500).json({
        error: err.message || "Something went wrong while updating profile.",
      });
    }
  }
);


module.exports = profileRouter;