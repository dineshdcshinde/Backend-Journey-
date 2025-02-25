const express = require("express");
const dbConnect = require("./db/db");
const userModel = require("./models/userModel");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This page belongs to the home page");
});

app.get("/form", (req, res) => {
  res.render("form");
});

// Create
app.post("/registerusers", async (req, res) => {
  const { userName, email, password } = req.body;

  const newUser = await userModel.create({
    userName,
    email,
    password,
  });

  res.send("UserCreated");
});

// Read
app.get("/getallusers", async (req, res) => {
  try {
    await userModel.find().then((users) => {
      res.send(users);
    });
  } catch (error) {
    console.log(error);
  }
});

// update
app.patch("/update", async (req, res) => {
  try {
    let user = await userModel.findOneAndUpdate(
      { userName: "a" },
      { userName: "Chandani" },
      { new: true }
    );
    res.send("User Updated");
  } catch (error) {
    console.log(`Error occuring due to ${error.message}`);
  }
});

// Delete
app.delete("/userdelete", async (req, res) => {
  try {
    let deleteUser = await userModel.findOneAndDelete({ userName: "Chandani" });
    res.send(`User Deleted, ${deleteUser}`);
  } catch (error) {
    console.log("Error occuring due to ${error.message}");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
