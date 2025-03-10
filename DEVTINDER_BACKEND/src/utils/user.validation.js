const validator = require("validator");

const validate = async (req) => {
  const {
    name,
    username,
    age,
    email,
    password,
    location,
    gender,
    profilePicture,
    interest,
    bio,
    lookingFor,
  } = req.body;

  const errors = [];

  // name validation

  if (!name || name.length < 3 || name.length > 50) {
    errors.push("Name must be 3 or 50 characters");
  }

  // username validation
  if (
    !username ||
    !/^[a-zA-Z0-9_]+$/.test(username) ||
    username.length < 5 ||
    username.length > 15
  ) {
    errors.push(
      "username must be in between 5 to 15 characters and can only contain letters, numbers and underscores "
    );
  }

  // age validation
  if (!age || isNaN(age) || age < 18) {
    errors.push("Age must be number and it should be at least 18.");
  }

  // email validation
  if (!email || !validator.isEmail(email)) {
    errors.push("Email must be a valid email address.");
  }

  // password validation
  if (
    !password ||
    password.length < 8 ||
    !validator.isStrongPassword(password)
  ) {
    errors.push(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  // location validation
  if (!location) {
    errors.push("Location required");
  }

  // gender validation
  if (!["male", "female", "other"].includes(gender)) {
    errors.push("Gender is not valid !");
  }

  // profile picture validation
  if (profilePicture && !validator.isURL(profilePicture)) {
    errors.push("Profile picture must be a valid URL");
  }

  // interest validation
  if (!Array.isArray(interest) || interest.length < 3 || interest.length > 10) {
    errors.push(
      "Interest must be an array with at least 3 and at most 10 elements."
    );
  }

  // bio validation
  if (!bio || bio.length < 10 || bio.length > 200) {
    errors.push("Bio must be between 10 and 200 characters.");
  }

  // lookingFor validations
  if (
    ![
      "male",
      "female",
      "other",
      "both",
      "relationship",
      "causal",
      "confused",
      "friendship",
    ].includes(lookingFor)
  ) {
    errors.push("Invlaid lookingFor value");
  }

  // if error present,
  return errors.length > 0 ? errors : null;
};

module.exports = validate;
