const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
// How do we create a userSchema
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength:4,
        maxLegth:50, 


    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase:true,
        trim:true,
        validate(value){
           if(!validator.isEmail(value)){
          throw new Error("Invalid Email addresss: "+value)
           }
        }

    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        enum:{
            values:["male","female","others"],
            message :`{VALUE} is not valid gender`
        }
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("Gender data is not valid")
        // }
        // }
    },
    photoUrl: {
        type: String,
        default:"https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_640.png"
    },
    about: {
        type: String,
        default:"This is default about user"
    },
    skills:{ 
        type:[String],
    },
   
},
{
    timestamps:true,
}
);
userSchema.methods.getJWT = async function (){

  const user = this;
     
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET , { expiresIn: '7d' })
   return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
       
    
    
 const user = this;
 const passwordHash = user.password;
 const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)
 return isPasswordValid;
}
//This is how we Create a moongose model 
// const User = mongoose.model("User",userSchema);
// module.exports = User;
module.exports = mongoose.model("User", userSchema);  