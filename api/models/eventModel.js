const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: 'title of the event'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: 'User owning the event'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  due_date: Date,
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending'
  },
  shortDescription: String,
  longDescription: String,
  likes: Array,
  comments: Array,
  event_type: {
    type: String,
    enum: ['cap', 'story', 'thanks', 'code', 'challenge']
  },
  target_type: {
    type: String,
    enum: ['all', 'team', 'user'],
    default: 'all'
  },
  target: Array

});

module.exports = mongoose.model('Events', EventSchema);
