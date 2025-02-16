const express = require("express");
const morgan = require("morgan");

const app = express();

app.set("view engine", "ejs");

// app.use((req, res, next) => {
//   console.log(`${req.method} request to ${req.url}`);
//   console.log( 5 + 5)
//   next();
// });

app.get("/", (req, res) => {
  //   res.send("This webpage belongs to the home page ");
  res.render("index");
});

app.get(
  "/profile",
  (req, res, next) => {
    console.log(5 + 5)
    next()
  },
  (req, res) => {
    res.send("This page belongs to the profile page ");
  }
);

app.listen(3000, () => {
  console.log("🚀 Server is listening on port 3000");
});
