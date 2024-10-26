const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name or last name is not valid.");
  }

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be between 4 to 50 characters.");
  }
  
  if (!validator.isEmail(emailId)) {
    throw new Error("Email address is not valid.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password.");
  }

  // If everything is valid, you can return true or handle accordingly
  return true;
};

const validateEditProfileData = (req) =>{

  const allowedEditFields = ["firstName","lastName" ,"age","photoUrl","about","skills"];
const isEditAllowed =  Object.keys(req.body).every(field=>allowedEditFields.includes(field));
return isEditAllowed;
  
}

const validateEditFieldValues = (req) => {
  const { firstName, lastName, age, photoUrl, about, skills } = req.body;

  // Check if firstName and lastName are present
  if (!firstName || !lastName) {
    throw new Error("First name or last name is not valid.");
  }

  // Validate firstName length
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be between 4 to 50 characters.");
  }

  // Validate about length (in words)
  const aboutWordCount = about.trim().split(/\s+/).length;
  if (aboutWordCount > 30) {
    throw new Error("About length can't be more than 30 words.");
  }

  // Validate age
  if (age < 18) {
    throw new Error("Age must be at least 18 years old.");
  }
  if (age > 100) {
    throw new Error("Age must be correct and below 100 years.");
  }

  // Validate skills length
  if (skills.length > 10) {
    throw new Error("Skills can't be more than 10.");
  }

  // Validate photoUrl if present
  if (photoUrl) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(photoUrl)) {
      throw new Error("Photo URL is not valid.");
    }
  }
  return true;
};



module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditFieldValues,
};
