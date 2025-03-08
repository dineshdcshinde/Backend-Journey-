const express = require("express");
const validate = require("../utils/user.validation");
const Authrouter = express.Router();
const userModel = require("../models/user.model");

Authrouter.post("/signup", async (req, res) => {
  try {
    const validationErrors = await validate(req);
    if (validationErrors) {
      return res.status(400).json({ error: validationErrors });
    }

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
      sexualOrientation,
      lookingFor,
    } = req.body;

    const user = await userModel.create({
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
      sexualOrientation,
      lookingFor,
    });

    res.status(200).json({ message: "user Crated", user });

    // create new user and save to db
    // generate jwt token and set it in cookies
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      errorOccurred: error.message,
    });
  }
});

module.exports = Authrouter;
