const express = require("express");
const router = express.Router();
const Message = require("../models/message")

const { userAuth } = require("../middlewares/auth");

router.get("/messages/:userId", userAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { fromUserId: currentUserId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: currentUserId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
