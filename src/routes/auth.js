const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { run } = require("../utils/sendEmail");

const isProd = process.env.NODE_ENV === "production";

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const emailId = req.body.emailId?.toLowerCase().trim();
    const password = req.body.password;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) throw new Error("Email already registered.");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      isEmailVerified: false,
    });

    await user.save();

    const emailToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

    await run({
      toAddress: emailId,
      fromName: "DevTinder",
      toName: firstName,
      type: "verify",
      verifyUrl: verificationUrl,
    });

    res.status(200).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

    // Optional: Auto-login after verification
    // const loginToken = await user.getJWT();
    // res.cookie("token", loginToken, {
    //   httpOnly: true,
    //   secure: isProd,
    //   sameSite: isProd ? "Strict" : "Lax",
    //   expires: new Date(Date.now() + 15 * 60 * 1000),
    // });

    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).send("Your verification link has expired.");
    }
    return res.status(400).send("Invalid or expired token.");
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const emailId = req.body.emailId?.toLowerCase().trim();
    const password = req.body.password;

    if (!validator.isEmail(emailId)) {
      throw new Error("Email address is not valid.");
    }

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("INVALID CREDENTIALS");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("INVALID CREDENTIALS");

    if (!user.isEmailVerified) {
      const emailToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

      await run({
        toAddress: emailId,
        fromName: "DevTinder",
        toName: user.firstName,
        type: "verify",
        verifyUrl: verificationUrl,
      });

      return res.status(401).json({
        error: "Please verify your email. A new verification link has been sent.",
      });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "Strict" : "Lax",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// LOGOUT
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.json({ message: "Logout successful" });
});

module.exports = authRouter;
