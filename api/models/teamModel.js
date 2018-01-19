const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: 'Team name'
  },
  score: {
    type: Number,
    default: 0
  },
  members: Array,
  leader: {
    type: String,
    required: 'Team leader'
  }
});

module.exports = mongoose.model('Teams', UserSchema);
