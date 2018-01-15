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
  }

});

module.exports = mongoose.model('Users', UserSchema);
