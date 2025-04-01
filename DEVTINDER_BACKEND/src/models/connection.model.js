const mongoose = require("mongoose");
const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true }
);

const ConnectionModel = new mongoose.model("connection", connectionSchema);

module.exports = ConnectionModel;
