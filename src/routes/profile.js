const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData,validateEditFieldValues} = require("../utils/validation")
const profileRouter = express.Router()
const validator = require("validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });


profileRouter.get("/profile/view",userAuth, async (req, res) => {

    try {
        const user = req.user;
         res.send(user);
    } catch (error) {

        res.status(401).send("Invalid or expired token" , error.message);
    }
});
profileRouter.patch("/profile/edit", userAuth, upload.single("photo"), async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    // Assign non-file fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // If a file was uploaded, update the photoUrl
    if (req.file) {
      loggedInUser.photoUrl = `/uploads/${req.file.filename}`;
    }

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
