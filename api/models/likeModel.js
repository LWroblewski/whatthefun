const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: String,
    required: 'User who like'
  },
  like_date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Likes', LikeSchema);
