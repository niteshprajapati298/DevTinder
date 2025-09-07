const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const connectDB = require("./config/database");
const setupSocket = require("./config/socket");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Attach Socket.io to the HTTP server with custom path
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "https://tinderdev.xyz","https://dev-tinder-web-pi.vercel.app","devtinder-production-a027.up.railway.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tinderdev.xyz"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", messageRouter);

// Setup socket
setupSocket(io);

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("✅ Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
