const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  login: {
    type: String,
    required: 'mail address'
  },
  password: {
    type: String,
    required: 'hashed password'
  },
  admin: {
    type: Boolean,
    default: false
  },
  firstname: String,
  lastname: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date,
  birthdate: Date,
  team: String,
  imageUrl: String,
  pseudo: String
});

module.exports = mongoose.model('Users', UserSchema);
