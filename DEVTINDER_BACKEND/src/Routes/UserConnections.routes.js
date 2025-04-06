const express = require("express");
const userConnectionRouter = express.Router();
const userauth = require("../middlewares/userauth.middlewares");
const ConnectionModel = require("../models/connection.model");

// Only this data will be sent back
const DATA_PUBLIC_PROFILE = ["name", "username", "location", "profilePicture"];

// request received route
userConnectionRouter.get("/requests/recieved", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", DATA_PUBLIC_PROFILE);

    if (connections.length === 0) {
      return res
        .status(404)
        .send({ message: "No connection requests found", connections });
    }

    res.status(200).send({ message: "Connection requests", connections });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// allConnections route
userConnectionRouter.get("/allConnections", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // only such connections where the status is accepted and fromUserId => loggedInUser or toUserId => loggedInUser
    const connections = await ConnectionModel.find({
      status: "accepted",
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).populate("fromUserId toUserId", DATA_PUBLIC_PROFILE);

    // If not then thorw no connections found
    if (connections.length === 0) {
      return res
        .status(404)
        .send({ message: "No connections found", connections });
    }

    // the loggedInUser data should not be shown (avoid redudancy!)
    const allConnections = connections.map((conn) => {
      // return conn.fromUserId._id.equals(loggedInUser._id)
      return String(conn.fromUserId._id) === String(loggedInUser._id)
        ? conn.toUserId
        : conn.fromUserId;
    });

    res.status(200).send({ message: "Your All connections", allConnections });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = userConnectionRouter;
