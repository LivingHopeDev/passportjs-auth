const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((error) => console.error(error));

module.exports = mongoose;
