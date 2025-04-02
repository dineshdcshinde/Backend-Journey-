const mongoose = require("mongoose");
const express = require("express");
const userauth = require("../middlewares/userauth.middlewares");
const ConnectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");
const Requestrouter = express.Router();

// From sender side

Requestrouter.post("/send/:status/:toUserId", userauth, async (req, res) => {
  try {
    // We are getting the status and toUserId from the req.params
    const { status, toUserId } = req.params;

    // we are getting the fromUserId from req.user._id
    const fromUserId = req.user._id;

    // Check if that toUserId exists or not
    const isUserExistInDB = await userModel.findById(toUserId);
    if (!isUserExistInDB) {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }

    // validate the status
    const validStatuses = ["ignored", "interested"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "failure",
        message: `${status} is not a valid status.`,
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide a valid userId",
      });
    }

    // the toUserId should not be the same as the fromUserId
    if (toUserId === fromUserId.toString()) {
      return res.status(400).json({
        status: "failure",
        message: "You cannot send a request to yourself",
      });
    }

    // check if it is already made a connection request
    const existingRequest = await ConnectionModel.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        status: "failure",
        message: "Connection request already exists...",
      });
    }

    // saving the data in the database
    const connection = new ConnectionModel({
      fromUserId,
      toUserId,
      status,
    });

    await connection.save();

    res.status(200).json({ message: "success", connection });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "failed", err: err.message });
  }
});

module.exports = Requestrouter;
