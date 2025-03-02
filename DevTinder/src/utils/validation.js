const validator = require("validator");

const validation = (req) => {
  const { username, email, password, gender, skills } = req.body;

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email,please enter a valid email");
  }
//   if (!validator.isStrongPassword(password)) {
//     throw new Error("Enter strong password");
//   }
};

module.exports = validation;
