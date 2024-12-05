const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"User",
          required: true,
        },
        toUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"User",
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: {
            values: ["interested", "accepted", "rejected", "ignored"],
            message: "{VALUE} is incorrect status type",
          },
        },
      },
      {
        timestamps: true,
      }
    );
    connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
    
    connectionRequestSchema.pre("save", function (next) {
      if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error("You cannot send a connection request to yourself"));
      }
      next();
    });
  


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;