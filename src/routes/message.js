const express = require("express");
const router = express.Router();
const Message = require("../models/message")

const { userAuth } = require("../middlewares/auth");

router.get("/messages/:userId", userAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { fromUserId: currentUserId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: currentUserId },
      ],
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // ⬅️ Improves performance

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/messages/:id", userAuth, async (req, res) => {
  const messageId = req.params.id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Optional: check if the current user owns this message
    if (message.fromUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await message.deleteOne();

    res.status(200).json({ message: "Deleted successfully", id: messageId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router