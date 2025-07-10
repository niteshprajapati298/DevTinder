const Message = require("../models/message");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Step 1: Join room (sent from frontend)
    socket.on("join_room", (userId) => {
      socket.join(userId); // each user joins their own room
      console.log(`✅ User ${userId} joined room`);
    });

    // Step 2: Send message to the recipient's room only
    socket.on("send_message", async (data) => {
      const { fromUserId, toUserId, message } = data;

      const savedMessage = await Message.create({ fromUserId, toUserId, message });

      // Send to the receiver only
      io.to(toUserId).emit("receive_message", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
