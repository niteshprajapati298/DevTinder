const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { run } = require("../utils/sendEmail"); // ✅ Correct import

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      throw new Error("Email already registered.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      isEmailVerified: false, // ✅ Track email verification
    });

    await user.save();

    // ✅ Generate verification token
    const emailToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

    // ✅ Send verification email
    await run({
      toAddress: emailId,
      fromName: "DevTinder",
      toName: firstName,
      type: "verify",
      verifyUrl: verificationUrl,
    });

    res.status(200).send("Verification email sent. Please check your inbox.");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// VERIFY EMAIL
authRouter.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) throw new Error("User not found");

    user.isEmailVerified = true;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    res.status(400).send("Invalid or expired token.");
  }
});

//login route
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Email address is not valid.");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("INVALID CREDENTIALS");
    }

    // ✅ Check if email is not verified
    if (!user.isEmailVerified) {
      // Generate a new email verification token
      const emailToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

      // ✅ Resend the verification email
      await run({
        toAddress: emailId,
        fromName: "DevTinder",
        toName: user.firstName,
        type: "verify",
        verifyUrl: verificationUrl,
      });

      return res.status(401).send("Please verify your email. A new verification link has been sent.");
    }

    const token = await user.getJWT();
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "Strict" : "Lax",
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    });

    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// LOGOUT
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful");
});

module.exports = authRouter;
