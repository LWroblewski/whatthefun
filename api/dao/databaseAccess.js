const mongoose = require("mongoose");
const config = require("../../config");
const url = config.database;
mongoose.Promise = global.Promise;
module.exports = mongoose.connect(url, function(err, db) {
  if (err) {
    console.log("Error connecting db : ", err);
    return;
  }
  console.log("Connected to db ", url);
});
