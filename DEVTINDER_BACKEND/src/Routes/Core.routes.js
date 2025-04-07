const express = require("express");
const userauth = require("../middlewares/userauth.middlewares");
const ConnectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");
const CoreRouter = express.Router();

// Get the connections
CoreRouter.get("/feed", userauth, async (req, res) => {
  try {

    const loggedInUser = req.user;
    // find all the connections and hide them


    const connectionRequests = await ConnectionModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await userModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })

    res.json({ data: users });




    /* 
        can't see self
        can't see where the request is send or received 
        can't see the user with the req ignored 
     */
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = CoreRouter;
