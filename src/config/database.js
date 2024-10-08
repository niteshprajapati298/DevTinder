const mongoose = require("mongoose");


const connectDB = async () => {
    mongoose.connect(
        "mongodb+srv://niteshprajapati:plvOeyvI7oZioy2S@nitesh.4iasx.mongodb.net/devTinder"
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