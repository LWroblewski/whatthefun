const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: 'title of the event'
  },
  owner: {
    type: String,
    required: 'User owning the event'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: 'Due date'
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  },
  short_desc: String,
  long_desc: String,
  likes: Array,
  comments: Array,
  event_type: String

});

module.exports = mongoose.model('Events', EventSchema);
