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

module.exports = {
  validateSignUpData,
};
