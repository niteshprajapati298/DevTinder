const express = require("express");

const app = express(); // when we call this we are creating a web server using express

// app.use() can handle all HTTP methods (GET, POST, etc.)
app.use("/", (req, res) => {
    res.send("Nitesh Prajapati");
});

app.use("/hello", (req, res) => {
    res.send("Hello Hellow Hello");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
});

