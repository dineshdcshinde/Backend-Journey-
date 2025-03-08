const express = require("express");
const app = express();
const dbConnection = require("./db/db");
const Authrouter = require("./Routes/Auth.routes");

app.use(express.json());

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

