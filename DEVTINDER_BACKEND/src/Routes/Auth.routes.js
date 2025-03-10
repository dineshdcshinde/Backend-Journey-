const express = require("express");
const validate = require("../utils/user.validation");
const Authrouter = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

Authrouter.post("/signup", async (req, res) => {
  /*
  1. validate (return statemement)
  2. install the bcrypt package and use the ".hash" for converting it into the hash format
  3. create a new user 
*/

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
      lookingFor,
    } = req.body;

    // create hash password with the bcrypt js
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user and save to db
    const user = await userModel.create({
      name,
      username,
      age,
      email,
      password: hashPassword,
      location,
      gender,
      profilePicture,
      interest,
      bio,
      lookingFor,
    });

    res.status(200).json({ message: "user Crated", user });
  } catch (error) {
    // duplicate key error collection
    if (error.code === 11000) {
      // code given by the mongodb
      return res
        .status(400)
        .json({ error: "Email or Username already exists" });
    }

    res.status(500).json({
      message: "Internal Server Error",
      errorOccurred: error,
    });
  }
});

Authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Find the user and if it doesn't exist, then thorw error

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare the hashed password with the password provided by the user otherwise throw an error
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Credentials are not correct" });
    }

    // 3. Generate a JWT token
    // const token = await jwt.sign({userId: user.id}, Secret,{expirary, errorCallback})

    // console.log(process.env.Login_TOKEN_SECRET_KEY)
    const token = await jwt.sign({ userId: user._id }, "devtinderSecretKey", {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "User Login Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorOccurred: error.message });
  }
});

module.exports = Authrouter;
