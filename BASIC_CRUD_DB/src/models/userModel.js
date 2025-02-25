const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: String,
  password: String,
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
