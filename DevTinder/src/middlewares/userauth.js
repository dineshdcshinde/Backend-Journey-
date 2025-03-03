const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Bad Gateway Authentication");
    }

    let decoded = await jwt.verify(token, "DEVTINDERSECRET");

    if (!decoded) {
      throw new Error("Bad Gateway Authentication");
    }

    const { userId } = decoded;

    const userDetails = await userModel.findById(userId);

    if (!userDetails) {
      throw new Error("User not found");
    }

    req.user = userDetails;

    next();
  } catch (err) {
    res.status(400).send("Error occured due to" + err.message);
  }
};

module.exports = auth;
