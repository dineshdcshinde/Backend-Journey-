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

app.post("/singup", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let userInfo = await userModel.create({
      userName,
      email,
      password,
    });
    res.send(userInfo);
  } catch (error) {
    console.log("Error occuring due to: " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find();

    res.send(users);
  } catch (err) {
    console.log("Error occuring due to: " + err.message);
  }
});
