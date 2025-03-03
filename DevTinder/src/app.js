const express = require("express");
const dbConnectionFun = require("./config/database");
const userModel = require("./models/user.model");
const app = express();
const bcrypt = require("bcrypt");
const validate = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userauth = require("./middlewares/userauth");
const authRouter = require("./routes/user.routes");

app.use(express.json());
app.use(cookieParser());

dbConnectionFun()
  .then(() => {
    console.log("🤝 DB connection established");
    app.listen(3000, () => {
      console.log("🚀 Server is listening on port 3000");
    });
  })
  .catch((err) =>
    console.log("Error occuring while connectiong to db: " + err)
  );

app.use("/", authRouter);

// profile - [get] getting the cookies
app.get("/profile", userauth, async (req, res) => {
  try {
    const userDetails = req.user;

    res.send(userDetails);
    // const { token } = req.cookies;

    // if (!token) {
    //   return res
    //     .status(401)
    //     .json({ message: "Unauthorized: Token is missing" });
    // }

    // const decoded = await jwt.verify(token, "DEVTINDERSECRET");

    // const { userId } = decoded;
    // const userDetails = await userModel.findById(userId);
    // if (!userDetails) {
    //   res.status(404).send("User not found");
    // }
    // res.send(userDetails);
  } catch (err) {
    console.log("Error occuring due to: " + err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Read
// user - [get] find the user by email
app.get("/user", async (req, res) => {
  try {
    const { email } = req.body;

    const getUser = await userModel.find({ email });

    getUser.length > 0
      ? res.send(getUser)
      : res.status(400).json({ message: "User not found" });
  } catch (err) {
    console.log("Error occuring due to: " + err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Read
// feed - [get] give all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find();

    res.send(users);
  } catch (err) {
    console.log("Error occuring due to: " + err.message);
  }
});

