const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose.connect("mongodb://localhost:27017/DEVTINDER")
  
};

module.exports = dbConnection;


// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   autoIndex: true,
// };