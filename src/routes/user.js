const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user")
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about";

userRouter.get("/user/connection/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const receivedConnectionRequests = await ConnectionRequests.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "received connection requests",
            data: receivedConnectionRequests,
        })

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }

})
userRouter.get("/user/connection", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequests.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("toUserId", USER_SAFE_DATA).populate("fromUserId", USER_SAFE_DATA)
        const data = connections.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({
            message: "My Connections",
            connection: data
        })

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // Retrieved from userAuth middleware
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page-1) * 10;

        // Fetch all connection requests involving the logged-in user
        const connectionRequest = await ConnectionRequests.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        // Build a set of user IDs to exclude from the feed
        const hideUserFromFeed = new Set();
        connectionRequest.forEach((request) => {
            hideUserFromFeed.add(request.toUserId.toString());
            hideUserFromFeed.add(request.fromUserId.toString());
        });

        // Exclude logged-in user as well
        hideUserFromFeed.add(loggedInUser._id.toString());

        // Find users who are not in the excluded set and are not the logged-in user
        const users = await User.find({
            _id: { $nin: Array.from(hideUserFromFeed) }
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.json({
            message: "People you may know",
            data : users, // Return users directly
        });
    } catch (error) {
        console.error("Error fetching user feed:", error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});
module.exports = userRouter;