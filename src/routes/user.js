const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about";

// ✅ Route: Received connection requests
userRouter.get("/user/connection/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedConnectionRequests = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Received connection requests",
      data: receivedConnectionRequests,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// ✅ Route: Accepted connections (shows OTHER user)
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequests.find({
      status: "accepted",
      $or: [
        { toUserId: loggedInUser._id },
        { fromUserId: loggedInUser._id },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    // 🧠 Return the other user in each connection
    const data = connections.map((conn) => {
      const from = conn.fromUserId;
      const to = conn.toUserId;

      return from._id.toString() === loggedInUser._id.toString() ? to : from;
    });

    res.json({
      message: "My Connections",
      connection: data,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// ✅ Route: Feed - people you may know
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequests.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    hideUserFromFeed.add(loggedInUser._id.toString());

    const users = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "People you may know",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching user feed:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

module.exports = userRouter;
