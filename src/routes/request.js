const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"]

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Request"
            })
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId,
                },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]

        })
        if (existingConnectionRequest) {
            return res.status(400).json({
                messaage: "Connection Request Already Exists"
            })
        }


        const user = await User.findOne({ _id: toUserId }); // Corrected syntax
        if (!user) {
            return res.status(400).json({
                message: "User does not exist in the database",
            });
        }




        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
        console.log(data)
        const emailRes = await sendEmail.run();
        console.log(emailRes);
        res.json({
            message: "Connection Requset Sent Successfully",
            data,
        })
    } catch (error) {
        res.status(401).send("Invalid or expired token: " + error.message);
    }
});

// Review a connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Validate request existence
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection request not found or invalid status" });
        }

        // Update and save connection request
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        

        res.json({
            message: `Connection request ${status}`,
            data,
        });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

module.exports = requestRouter;
