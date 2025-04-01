const express = require("express");
const validate = require("../utils/user.validation");
const Authrouter = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userauth = require("../middlewares/userauth.middlewares");
const nodemailer = require("nodemailer");
const validator = require("validator");
const { validProfileData } = require("../utils/validProfile.data");

// /signup [post]
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

// login [post]
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

    res.cookie("token", token);

    res.status(200).json({ message: "User Login Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorOccurred: error.message });
  }
});

// profile [get]
Authrouter.get("/profile/view", userauth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorOccurred: error.message });
  }
});

// logout [post]
Authrouter.post("/logout", userauth, async (req, res) => {
  try {
    // validate and get the user & token
    const user = req.user;
    const { token } = req.cookies;

    // remove the token from the cookies
    res.clearCookie("token", { httpOnly: true, secure: true });
    // only we want to pass the name of the token which we want to remove or clear
    /*
      httpOnly: true >> Not allow to steal the cookie with the js (document.cookie)
      secure: true >> Only send the cookie over HTTPS (not HTTP)
    */

    res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorOccurred: error.message });
  }
});

// ForgetPassword -[post]
Authrouter.post("/forgetPassword", async (req, res) => {
  try {
    // get the email and find in the  & make the validations
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid Email. Enter the valid email" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generating the token

    const resetToken = await jwt.sign(
      { userId: user._id },
      "ForgetPasswordTokenSecret",
      { expiresIn: "15m" }
    );

    //  Creating the link and passing the token in that and sending it on the email with the nodemailer package
    const resetLink = `http://localhost:3000/devTinder/resetPassword/${resetToken}`;

    // need to add the nodemailer part

    res.status(200).json({ message: "Reset Link is generated!!!", resetLink });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// ResetPassword - [patch]
Authrouter.patch("/resetPassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // validate the password and confirmpassword
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirmPassword should be required." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirmPassword should be same." });
    }

    // convert the password to the hash
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    // token verify and get the userId
    const decoded = await jwt.verify(token, "ForgetPasswordTokenSecret");

    if (!decoded) {
      return res.status(400).json({ message: "Token is invalid or expired." });
    }

    const userId = decoded.userId;

    // findByIdAndUpdate
    const passwordReset = await userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,   
    });

    if (!passwordReset) {
      return res
        .status(400)
        .json({ message: "Error while resetting the password" });
    }

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//  updateProfileData - [patch] (protected)
Authrouter.patch("/profile/update", userauth, async (req, res) => {
  try {
    if (!validProfileData(req)) {
      return res.status(400).json({ message: "Invalid profile data" });
    }
    const userLoggedIn = req.user;

    Object.keys(req.body).forEach((key) => (userLoggedIn[key] = req.body[key]));

    await userLoggedIn.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = Authrouter;
