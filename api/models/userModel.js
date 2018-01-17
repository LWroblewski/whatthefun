const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: Schema.ObjectId
  },
  login: {
    type: String,
    required: 'mail address'
  },
  password: {
    type: String,
    required: 'hashed password'
  },
  admin: Boolean

});

module.exports = mongoose.model('Users', UserSchema);
