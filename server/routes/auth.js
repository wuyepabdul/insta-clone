const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authToken = require("../middleware/verifyToken");
const {
  signupValidator,
  signinValidator,
  validatorResult,
} = require("../middleware/validator");
const { JWT_SECRET, JWT_EXPIRE, API_KEY, EMAIL } = require("../config/prod");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: API_KEY,
    },
  })
);

router.get("/", authToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
      .select("-password ")
      .select("-createdAt")
      .select("-updatedAt")
      .select("-__v");
    if (!user) {
      return res.status(404).json({ errorMessage: "No User Found" });
    }
    res.json(user);
  } catch (error) {
    return res
      .status(404)
      .json({ errorMessage: "Server Error..try again later" });
  }
});

router.post("/signup", signupValidator, validatorResult, async (req, res) => {
  const { username, email, password, photo } = req.body;

  const existingUser = await User.findOne({ email });
  try {
    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "User Already Exist with this email" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photo,
    });
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(400).json({ message: "Bad Request, try again later" });
    }
    transporter.sendMail({
      to: savedUser.email,
      from: "wuyepabdul@gmail.com",
      subject: " sign up success",
      html: "<h1> Welcome to Insta-clone </h1>",
    });

    res.status(200).json({
      message: "User Saved to DB",
    });
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
});

router.post("/signin", signinValidator, validatorResult, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(422).json({ errorMessage: "Invalid Credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE },
        (err, token) => {
          if (err) {
            return res.status(422).json({ message: "jwt error" });
          }
          const { _id, username, email, followers, following, photo } = user;
          res.json({
            token,
            user: { id: _id, username, email, followers, following, photo },
          });
        }
      );
    } else {
      return res.status(422).json({ errorMessage: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
});

router.post("/resetPassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.status(422).json({ errorMessage: err });
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        (user.resetToken = token), (user.expireToken = Date.now() + 3600000);
        user
          .save()
          .then((result) => {
            transporter.sendMail({
              to: user.email,
              from: "wuyepabdul@gmail.com",
              subject: "Reset Password",
              html: `<p> Password Reset </p> 
          Click this <a href='${EMAIL}/resetPassword/${token}'> Link to reset password </a>`,
            });
            res.json({ message: "Check your email for password reset link" });
          })
          .catch((err) => {
            return res.status(422).json({
              errorMessage: err,
            });
          });
      })
      .catch((err) => {
        return res.status(422).json({ errorMessage: err });
      });
  });
});

router.post("/newPassword", async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  await User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ errorMessage: "Session Expired..try again" });
      }

      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        (user.password = hashedPassword),
          (user.expireToken = undefined),
          (user.expireToken = undefined);

        const savedUser = user.save();
        if (!savedUser) {
          return res
            .status(422)
            .json({ errorMessage: "error encountered in saving new password" });
        }
        res.json({ message: "Password reset successfull" });
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ errorMessage: "Server error..try again later" });
    });
});

module.exports = router;
