const express = require("express");
const connectDB = require("./config/database");
const app = express(); // when we call this we are creating a web server using express
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')


app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);


connectDB()
    .then((result) => {
        console.log("Database connection established...");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        });
    })
    .catch((err) => {
        console.log("Database cannot be connected");
    });
