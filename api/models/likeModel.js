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
  },
  target: {
    type: String,
    required: 'id of the like\'s target'
  }

});

module.exports = mongoose.model('Likes', LikeSchema);
