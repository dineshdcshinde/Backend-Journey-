const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [5, "required 5 characters"],
    required: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: [5, "required 5 characters"]
  },
  email: {
    type: String,
    unique: true, 
    lowercase: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    default: "male",
  },
  skills: {
    type: [String],
  },
});


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
