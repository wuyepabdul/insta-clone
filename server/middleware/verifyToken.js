const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const authToken = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(422).json({ message: "Access Denied" });
  }
  try {
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(422).json({ message: "Invalid Token" });
    }
    const { _id } = verified;
    const userData = await User.findById(_id);
    req.user = userData;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = authToken;
