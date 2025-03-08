const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "At least 3 characters are required"],
      maxLength: [50, "At most 50 characters are required"],
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: [5, "At least 5 characters are required"],
      maxLength: [15, "At most 15 characters are required"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
      index: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "The minimum age is 18"],
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "At least 8 characters are required"],
      trim: true,
    },
    location: {
      type: [String],
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
      index: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhAq96S4rzot47qiaT2Q65A3Jc3vLAUaKWKA&s",
      trim: true,
    },
    interest: {
      type: [String],
      required: true,
      trim: true,

      validate: {
        validator: function (arr) {
          return arr.length >= 3 && arr.length <= 10;
        },
        message: "At least 3 and at most 10 interests are required",
      },
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, "At least 10 characters are required"],
      maxLength: [200, "At most 200 characters are required"],
    },
    sexualOrientation: {
      type: String,
      required: true,
      enum: ["straight", "gay", "bisexual", "other"],
    },
    lookingFor: {
      type: String,
      required: true,
      enum: [
        "male",
        "female",
        "other",
        "both",
        "relationship",
        "causal",
        "confused",
        "friendship",
      ],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
