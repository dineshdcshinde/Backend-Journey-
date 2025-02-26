const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");

// use to provide the secret from the env
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = require("./config/db");
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/user", userRouter);

app.listen(3000, () => console.log("App listening on port 3000 🚀"));
