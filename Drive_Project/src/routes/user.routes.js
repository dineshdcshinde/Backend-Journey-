const express = require("express");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",

  body("email").trim().isLength({ min: 9 }),
  body("username").trim().isLength({ min: 3 }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(401).json({
          errors: errors.array(),
          message: "Invalid Data",
        });
      }
      const { email, username, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        email,
        username,
        password: hashPassword,
      });

      res.send(user);
    } catch (error) {
      console.log(error);
      res.status(501).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",

  body("username").trim(),
  body("password").trim().isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        errors: errors.array(),
        message: "Invalid Data",
      });
    }

    const { username, password } = req.body;

    const user = await userModel.findOne({
      username,
    });

    if (!username) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "username or password is incorrect" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);
    res.send("log in successfully");
  }
);

module.exports = router;
