
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const adminAuth = (req,res,next) =>{
//  const token = 'xyz';
//  const isAdminAuthorized = token === 'xyz';
// if (!isAdminAuthorized) {
//   res.status(401).send("UnAuthorized request");
// } else {
//     next();
// }
// }
// const userAuth = (req,res,next) =>{
//  const token = 'xyz';
//  const isUserAuthorized = token === 'xyz';
// if (!isUserAuthorized) {
//   res.status(401).send("UnAuthorized request");
// } else {
//     next();
// }
// }
const userAuth = async (req,res,next)=>{

    try {
        const {token} = req.cookies;
        const decodedObj =  jwt.verify(token, "DEVtinder@123");

        if(!token){
            return res.status(401).send('Please Login')
        };
        const {_id }= decodedObj;

         const user = await User.findById(_id);

        if(!user){
          throw new Error("User not found");
        }
        req.user = user;
        next();
        
    } catch (error) {
        res.status(400).json({"ERROR":error.message})
    }

}


module.exports={
   
    userAuth
}