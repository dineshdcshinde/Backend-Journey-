const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const userauth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // token not present
    if (!token) {
      throw new Error("Bad Gateway Authentication, Please Login again!!");
    }

    // if token present, then verify it -
    const decoded = await jwt.verify(token, "devtinderSecretKey");

    if (!decoded) {
      return res.status(403).json({ message: "Please, Login again !" });
    }

    // remove the userId so that u can findout that particular user
    const { userId } = decoded;

    // findout the user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 module.exports = userauth;



