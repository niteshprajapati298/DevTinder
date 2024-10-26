const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData,validateEditFieldValues} = require("../utils/validation")
const profileRouter = express.Router()
const validator = require("validator");

profileRouter.get("/profile/view",userAuth, async (req, res) => {

    try {
        const user = req.user;
         res.send(user);
    } catch (error) {

        res.status(401).send("Invalid or expired token" , error.message);
    }
});
profileRouter.patch("/profile/edit",userAuth, async (req,res) => {

       
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Profile Edit Failed");

        }
        if(!validateEditFieldValues(req)){
            throw new Error("Invalid Edit");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]))
        await loggedInUser.save();

        res.json({
            message:`${loggedInUser.firstName} , your profile updated successfully`,
            data: loggedInUser,
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    };
});

module.exports = profileRouter;
