const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
