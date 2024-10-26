const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        res.send("Connection Request Sent!!!");
    } catch (error) {
        res.status(401).send("Invalid or expired token: " + error.message);
    }
});

module.exports = requestRouter;
