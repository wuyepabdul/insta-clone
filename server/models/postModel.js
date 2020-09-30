const mongoose = require("mongoose");
//const { ObjectId } = mongoose.Schema.Types;
var ObjectId = require("mongodb").ObjectID;

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    photo: { type: String, required: true },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      { text: { type: String }, postBy: { type: ObjectId, ref: "User" } },
    ],
    postBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
