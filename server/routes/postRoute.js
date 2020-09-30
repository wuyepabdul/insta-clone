const { postValidator, validatorResult } = require("../middleware/validator");
const authToken = require("../middleware/verifyToken");
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

const router = require("express").Router();

router.get("/allPosts", async (req, res) => {
  await Post.find()
    .sort({ createdAt: -1 })
    .populate("postBy", "_id username")
    .populate("comments.postBy", "_id username")
    .then((allPosts) => {
      res.status(200).json({ allPosts });
    })
    .catch((err) => {
      res.status(422).json({ errorMessage: "No Posts At this time" });
    });
});

router.get("/subscribedPosts", authToken, async (req, res) => {
  try {
    await Post.find({ postBy: { $in: req.user.following } })
      .populate("postBy", "_id username")
      .populate("comments.postBy", "_id username")
      .then((posts) => {
        if (!posts) {
          return res.status(422).json({
            errorMessage:
              "No subscribed posts..follow a user to get subscribed posts",
          });
        }
      })
      .catch((err) => {
        return res.status(422).json({ errorMessage: err });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Server Error..try again later" });
  }
});

router.post(
  "/createPost",
  postValidator,
  validatorResult,
  authToken,
  async (req, res) => {
    const { title, content, photo } = req.body;
    try {
      req.user.password = undefined;

      const newPost = new Post({
        title,
        content,
        photo,
        postBy: req.user,
      });
      if (!newPost) {
        return res
          .status(422)
          .json({ errorMessage: "Bad request.. Please try again later" });
      }
      const savedPost = await newPost.save();
      res.json({ message: "New Post Created", savedPost });
    } catch (error) {
      return res.status(500).json({ errorMessage: "Server Error" });
    }
  }
);

router.get("/myPosts", authToken, async (req, res) => {
  try {
    const myPost = await Post.find({ postBy: req.user._id }).populate(
      "postBy",
      "_id username"
    );
    if (!myPost) {
      return res.status(404).json({ errorMessage: "No Post found" });
    }
    return res.status(200).json({ myPost });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Bad Request" });
  }
});

router.put("/like", authToken, async (req, res) => {
  await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postBy", "_id username")
    .populate("comments.postBy", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ errorMessage: err });
      }
      res.json(result);
    });
});

router.put("/unlike", authToken, async (req, res) => {
  await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postBy", "_id username")
    .populate("comments.postBy", "_id username")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ errorMessage: err });
      }
      res.json(result);
    });
});

router.put("/comment", authToken, async (req, res) => {
  const comment = {
    text: req.body.text,
    postBy: req.user._id,
  };
  await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postBy", "_id username")
    .populate("postBy", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ errorMessage: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletePost/:postId", authToken, async (req, res) => {
  await Post.findOne({ _id: req.params.postId })
    .populate("postBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(404).json({ errorMessage: err });
      }
      if (post.postBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ errorMessage: err });
          });
      }
    });
});

module.exports = router;
