require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./db/db");
const Authrouter = require("./Routes/Auth.routes");
const cookieParser = require("cookie-parser");

app.use(express.json());

// reading for the cookies data
app.use(cookieParser());

app.use("/devTinder", Authrouter);

dbConnection()
  .then(() => {
    console.log("DB Connection established 🤝");
    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });
  })
  .catch((err) => {
    res.status(500).send({ message: "failed", err: err });
  });
