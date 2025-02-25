const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");

// use to provide the secret from the env
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = require("./config/db");
connectToDB()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/user", userRouter);

app.listen(3000, () => console.log("App listening on port 3000 🚀"));
