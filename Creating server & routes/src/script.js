const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("🚀 App is listening on port 3000");
});

// app.use((req,res)=>{
//   res.send("Hello, Dinesh")
// })

app.get("/", (req, res) => {
  res.send("You are connected to the Home Page");
});

app.post("/post/:username/:id", (req, res) => {
  const { username, id } = req.params;
  console.log(req.params);
  res.send(`You are connected to the ${username} Page`);
});

app.get("/contact", (req, res) => {
  res.send("You are connected to the Contact Page");
});

app.get("/help", (req, res) => {
  res.send("You are connected to the Help Page");
});


app.get("*", (req, res) => {
  res.send("404 - Route Not Found");
});