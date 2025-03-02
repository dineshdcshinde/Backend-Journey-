const express = require("express");
const dbConnectionFun = require("./config/database");
const userModel = require("./models/user.model");
const app = express();
const validation = require("./utils/validation");
const bcrypt = require("bcrypt");
const validate = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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

// Create
// singup - [post] create a new user
app.post("/singup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
      const token = await jwt.sign({ userId: user._id }, "DEVTINDERSECRET");
      console.log(token);

      // sending it in the cookie
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

// profile - [get] getting the cookies
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }



    const decoded = await jwt.verify(token, "DEVTINDERSECRET");

    const { userId } = decoded;
    const userDetails = await userModel.findById( userId );
    if (!userDetails) {
      res.status(404).send("User not found");
    }
    res.send(userDetails);
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

// Update
// userupdate - [patch] it will update the specific part
app.patch("/userupdate", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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
