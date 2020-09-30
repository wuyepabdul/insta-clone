var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    expireToken: { type: Date },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/dulswuyep/image/upload/v1601038023/profiles/noPic2_rmgvsc.png",
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
