const mongoose = require("mongoose");
const User = mongoose.model("Users");


module.exports = function() {
  const priv = "private var";
  return {
    getJwt: function(creds) {
      console.log("Creds Login :" + creds.login);
      return priv;
    },

    getUsers: function(filter) {
      console.log("Get all users");
      User.find({}, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    },

    getUserById: function(id) {

      User.findById({
        id
      }, function(err, user) {
        if (err) {
          console.error(err);
          return null;
        }
        console.log(user);
        return user;
      });

    },

    getUserByLogin: function(login) {
      console.log("Get user");
      //...findById({req.params.userId} ...
      User.findOne({
        login: login.id
      }, function(err, user) {
        if (err) {
          console.error(err);
          return null;
        }
        console.log(user);
        return user;
      });
    },

    updateUser: function(user) {
      console.log("Update user");
      User.findOneAndUpdate({
        login: req.params.userId
      }, req.body, {
        new: true
      }, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    },

    createUser: function(user) {
      console.log("Create user");
      const newUser = new User(req.body);
      newUser.save(function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    },

    deleteUser: function(user) {
      console.log("Delete user");
      User.remove({
        _id: req.params.userId
      }, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json({
          message: 'User successfully deleted'
        });
      });
    }


  }

}
