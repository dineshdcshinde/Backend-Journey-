const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://localhost:27017/CRUD").then(() => {
  console.log("Connection established 🤝 ");
});

module.exports = connect;
