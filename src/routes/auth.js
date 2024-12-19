const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");


authRouter.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req);

        //Encrypt the password  ::: 
        const { firstName, lastName, emailId, password, age, photoUrl, about, skills } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName
            , lastName
            , emailId
            , password: passwordHash
            , age
            , photoUrl
            , about
            , skills

        });


        await user.save();
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
});



authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Email address is not valid.");
        }

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("INVALID CREDENTIALS")
        }

        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            // Create a JWT token
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            res.send(user);
        }
        else {

            throw new Error("INVALID CREDENTIALS");

        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie(
        "token", null,
        {
            expires: new Date(Date.now())
        });
    res.send("Logout Successfull");

});


module.exports = authRouter;

