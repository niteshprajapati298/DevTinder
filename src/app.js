const express = require("express");
const connectDB = require("./config/database");
const app = express(); // when we call this we are creating a web server using express
const User = require("./models/user");

app.use(express.json());

app.post("/signup",async (req,res)=>{
    // console.log(req.body);
     
//  const userobject = {

//     firstName:"Nitesh",
//     lastName:"Prajapati",
//     emailId:"niteshkmrprajapati298@gmail.com",
//     password:"nitesh@123"
//  }
 //Creating a new instance of the User model
 const user = new User(req.body)
 try {
    await user.save();
 res.send("User Added Successfully")
 } catch (err) {
    res.status(400).send("Error saving the user: ",err.message)
 }
});


connectDB()
.then((result) => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777...");
    });
    
}).catch((err) => {
    console.log("Database cannot be connected")
});




