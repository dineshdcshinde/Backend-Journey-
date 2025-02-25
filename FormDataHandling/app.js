const express = require("express");
const app = express();

app.set("view engine", "ejs");

// This are only used when we want the data from the **req.body**
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("form");
  // res.send("This page belongs to the home page");
});

// To solve the problem, as the will show the sensitive info
// app.get("/form", (req, res) => {
//   console.log(req.query);
//   console.log(req.body);
//   res.send("Form Submitted");
// });

app.post("/form", (req, res) => {
  console.log(req.body);
  res.send("Form Submitted");
});

app.listen(3000, () => {
  console.log("🚀 Server listening on port 3000");
});
 