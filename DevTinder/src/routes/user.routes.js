const express = require("express");
const authRouter = express.Router();
const validation = require("../utils/validation");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const validate = require("validator");
const userauth = require("../middlewares/userauth");
const jwt = require("jsonwebtoken")

// Create
// singup - [post] create a new user
authRouter.post("/singup", userauth, async (req, res) => {
  try {
    // validate the req.body
    validation(req);
    const { username, email, password, gender, skills } = req.body;

    // convert the password into the hash format with the help of the bcrypt
    const hashPassword = await bcrypt.hash(password, 10);

    let userInfo = await userModel.create({
      username,
      email,
      password: hashPassword,
      gender,
      skills,
    });
    res.send(userInfo);
  } catch (error) {
    console.log("Error occuring due to: " + error.message);
  }
});

// login - [post] login a user
authRouter.post("/login",userauth,  async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validate.isEmail(email)) {
      throw new Error("Invalid Email");
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    let isMatch = await bcrypt.compare(password, user.password);


    if (isMatch) {
      // generate the token
      const token = await jwt.sign({ userId: user._id }, "DEVTINDERSECRET", {
        expiresIn: "7d",
      });

      // sending it in the cookie
      // res.cookie("token", token, {
      //   expires: new Date(Date.now() + 15 * 60 * 1000),
      // });
      res.cookie("token", token);

      res.send("User login successfully");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    console.log("Error occuring due to: " + error.message);
    res.status(400).send("Invalid Credentials");
  }
});


// Update
// userupdate - [patch] it will update the specific part
authRouter.patch("/userupdate",userauth, async (req, res) => {
  try {
    const { email, username, password, gender, skills } = req.body;

    if (password.length < 5 || username.length < 3) {
      return res
        .status(400)
        .json({ message: "Password & username should be more than 5 chars" });
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        username,
        password,
        gender,
        skills,
      }
    );

    updatedUser
      ? res.send("User Updated")
      : res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log("Error occuring due to: " + error.message);
    res.status(500).json({ message: "Internal Server Error" + error.message });
  }
});

// Delete
// user - [delete] it will delete
authRouter.delete("/user",userauth, async (req, res) => {
  try {
    const { email } = req.body;
    const deleteUser = await userModel.findOneAndDelete({ email });
    // It is very important that to wrap the data with the {}

    deleteUser
      ? res.send("User Deleted")
      : res.status(404).json({ message: "User not Deleted" });
  } catch (err) {
    console.log("Error occuring due to: " + err.message);
    res.status(500).send("Internal Server Error");
  }
});






module.exports = authRouter;
