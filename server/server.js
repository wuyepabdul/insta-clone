const express = require("express");
require("dotenv").config();
const connection = require("./db/connection");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();
require("./models/userModel");
require("./models/postModel");

// middlewares
const authRoute = require("./routes/auth");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");

app.use(cors());
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);
app.use("/api/profile", userRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

connection();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
