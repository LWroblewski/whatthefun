const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: {
    type: String,
    required: 'User author the comment'
  },
  written_date: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: 'Content of the comment'
  },
  likes: Array

});

module.exports = mongoose.model('Comments, CommentSchema');
