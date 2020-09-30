const router = require("express").Router();
const mongoose = require("mongoose");
const authToken = require("../middleware/verifyToken");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.put("/follow", authToken, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ errorMessage: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ errorMessage: err });
        });
    }
  );
});

router.put("/unfollow", authToken, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatePhoto", authToken, async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        photo: req.body.photo,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ errorMessage: err });
      }

      res.json(result);
    }
  );
});
/* router.get("/searchResult", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id email username")
    .then((user) => {
      if (!user) {
        return res.status(422).json({ errorMessage: "No User Found" });
      }
      res.json({ user });
    })
    .catch((err) => {
      return res.status(500).json({ errorMessage: "Server Error" });
    });
}); */

router.post("/searchResult", async (req, res) => {
  try {
    let userPattern = new RegExp(`^ ${req.body.query}`);
    await User.find({ email: new RegExp(`^${req.body.query}`) })
      .select("_id email username")
      .then((user) => {
        res.json({ user });
      })
      .catch((err) => res.status(422).json({ errorMessage: err }));
  } catch (error) {
    return res.status(500).json({ errorMessage: "Could not  process result" });
  }
});

router.get("/:userId", authToken, (req, res) => {
  try {
    User.findOne({ _id: req.params.userId })
      .select("-password")
      .then((user) => {
        Post.find({ postBy: req.params.userId })
          .populate("postBy", "_id username")
          .exec((err, posts) => {
            if (err) {
              return res.status(422).json({ errorMessage: err });
            }
            res.json({ user, posts });
          });
      })
      .catch((err) => {
        return res.status(500).json({ errorMessage: "No User Found" });
      });
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
