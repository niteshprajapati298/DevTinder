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
    res.status(400).send("Error saving the user: "+err.message)
 }
});

// app.get("/user",async (req,res)=>{
//  const userEmail = req.body.emailId;
//  try {
//     const user = await User.find({emailId:userEmail});
//     if(user.length === 0){
//         res.status(401).send("No user found");
//     }
//     else{
//         res.send(user);
//     }
//  } catch (error) {
//     res.status(401).send("Something went wrong")
//  }
// })
app.get("/user", async (req, res) => {
    const userEmail = req.query.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(401).send("No user found");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(401).send("Something went wrong");
    }
});
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            res.status(500).send("No Users Found");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(401).send("Something went wrong");
    }
});
app.get("/userbyid", async (req, res) => {
    const userid = req.body.id;
    try {
        const user = await User.findById(userid);
        res.send(user);
    } catch (error) {
        res.status(401).send("Something went wrong");
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId; // Ensure the userId is being sent in the request body
    try {
        const user = await User.findByIdAndDelete(userId); // Pass userId directly
        if (!user) {
            return res.status(404).send("User not found"); // Handle case where user is not found
        }
        res.send("User Deleted Successfully");
    } catch (error) {
        res.status(500).send("Something went wrong"); // 500 for server error
    }
});
app.patch("/user/:userId", async (req, res) => {
    // const _id = req.body._id;
    const _id = req.params?.userId;
    const data = req.body;

    try {
        const Allowed_Updates = ["photoUrl","age","gender","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>Allowed_Updates.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
            
        }
        
        const updatedUser = await User.findByIdAndUpdate(_id, data,{
            runValidators:true,
        });
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(404).send("Update failed"+error.message);
    }
});

//Updating user by emailId
// app.patch("/user", async (req, res) => {
//     const email = req.body.emailId;
//     const data = req.body;

//     try {
//         const updatedUser = await User.findOneAndUpdate(
//             { emailId: email },  // Find user by email
//             data,
//             { new: true, runValidators: true }  // Ensure updated user is returned and validations are run
//         );
//         res.send("User Updated Successfully");
//     } catch (error) {
//         res.status(404).send("Something went wrong");
//     }
// });


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
