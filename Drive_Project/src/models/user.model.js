const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: 20,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: [5, "Password must be at least 5 characters"],
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
