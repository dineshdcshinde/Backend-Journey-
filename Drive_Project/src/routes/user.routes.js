const express = require("express");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register",

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

      const user = await userModel.create({
        email,
        username,
        password,
      });

      res.send(user);
    } catch (error) {
      console.log(error);
      res.status(501).json({ message: "Internal Server Error" });
    }
  }
);
module.exports = router;
