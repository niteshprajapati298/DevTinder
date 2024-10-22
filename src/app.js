const express = require("express");
const connectDB = require("./config/database");
const validator = require("validator");
const app = express(); // when we call this we are creating a web server using express
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./utils/validation")
app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req);

        //Encrypt the password  ::: 
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName
            , lastName
            , emailId
            , password: passwordHash
        }); ~


            await user.save();
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
});
app.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Email address is not valid.");
        }

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("INVALID CREDENTIALS")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // Create a JWT token
            const token = await jwt.sign({ _id: user._id }, "DEVtinder@123")
            res.cookie("token", token);
            res.send("Login Successful");
        }
        else {

            throw new Error("INVALID CREDENTIALS");

        }



    } catch (error) {
        res.status(400).send(error.message);
    }
});
app.get("/profile", async (req, res) => {
    const cookies = req.cookies;
    const { token } = cookies;


    try {
        if (!token) {
            throw new Error("No User Found");
        }
        const decodedMessage = await jwt.verify(token, "DEVtinder@123");
        console.log(decodedMessage);
        // we can get the id from decoded messsage
         const { _id } = decodedMessage;
         const user = await User.findOne({_id:_id}) 
         res.send(user);
    } catch (error) {
        console.error("Invalid Token", error);
        res.status(401).send("Invalid or expired token");
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
        const Allowed_Updates = ["photoUrl", "age", "gender", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => Allowed_Updates.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");

        }

        const updatedUser = await User.findByIdAndUpdate(_id, data, {
            runValidators: true,
        });
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(404).send("Update failed" + error.message);
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
