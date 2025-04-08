const express = require("express");
const userauth = require("../middlewares/userauth.middlewares");
const ConnectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");
const CoreRouter = express.Router();

// DATA_PUBLIC_PROFILE
const DATA_PUBLIC_PROFILE = ["name", "username", "location", "profilePicture"];

// Get the connections
CoreRouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // get the user's collections so that we can avoid them to come in the feed
    const connections = await ConnectionModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    // we will create a alghorithm with the "new Set()" that will only add the unique elements
    const hideUsersFromFeed = new Set();

    // we added the each req into the hideUsersFromFeed
    connections.map((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // find the connections in which this entries should not match
    const feed = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(DATA_PUBLIC_PROFILE);

    res.send(feed);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", err: err.message });
  }
});

module.exports = CoreRouter;
