const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { run } = require("../utils/sendEmail"); // ✅ Corrected import

// Send a connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection Request Already Exists" });
    }

    const toUser = await User.findById(toUserId);
    const fromUser = await User.findById(fromUserId);

    if (!toUser || !fromUser) {
      return res.status(400).json({ message: "User does not exist in the database" });
    }

    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
    const data = await connectionRequest.save();

    // Send email if status is interested
    if (status === "interested") {
      await run({
        toAddress: toUser.emailId,
        fromName: fromUser.firstName,
        toName: toUser.firstName,
        type: "interested"
      });
    }

    res.json({
      message: "Connection Request Sent Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
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

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection request not found or already reviewed" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    // Send email if accepted
    if (status === "accepted") {
      const fromUser = await User.findById(connectionRequest.fromUserId);
      const toUser = await User.findById(connectionRequest.toUserId);

      if (fromUser && toUser) {
        await run({
          toAddress: fromUser.emailId,
          type: "accepted",
          fromName: toUser.firstName,
          toName: fromUser.firstName
        });
      }
    }

    res.json({
      message: `Connection request ${status}`,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

module.exports = requestRouter;
