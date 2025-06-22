const mongoose = require("mongoose");


const connectDB = async () => {
    mongoose.connect(
       process.env.MONGODB_URI
    );
}

module.exports = connectDB;
// connectDB()
// .then(() => { 
//     console.log("Database connection Established")
// })
// .catch((err) => { 
//     console.error("Databae cannot be connected")
// })