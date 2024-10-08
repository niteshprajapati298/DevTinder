const mongoose = require("mongoose")
// How do we create a userSchema
const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
});


//This is how we Create a moongose model 
// const User = mongoose.model("User",userSchema);
// module.exports = User;
module.exports = mongoose.model("User",userSchema);  