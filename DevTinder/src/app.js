const express = require("express");
const dbConnectionFun = require("./config/database");
const userModel = require("./models/user.model");
const app = express();

app.use(express.json());

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
    const { username, email, password, gender, skills } = req.body;
    let userInfo = await userModel.create({
      username,
      email,
      password,
      gender,
      skills,
    });
    res.send(userInfo);
  } catch (error) {
    console.log("Error occuring due to: " + error.message);
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
