

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
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Please login to access this resource" });
    }

    const decodedObj = jwt.verify(token, "DEVtinder@123");

    const user = await User.findById(decodedObj._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  userAuth,
};
