const mongoose = require("mongoose");
const { MONGODB_ATLAS } = require("../config/prod");
require("dotenv").config();
const db = MONGODB_ATLAS;
const connection = () => {
  mongoose.connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      try {
        if (!err) {
          console.log("Connection to Mongodb Established");
        }
      } catch (error) {
        console.log("error connecting to mongodb", error);
      }
    }
  );
};

module.exports = connection;
