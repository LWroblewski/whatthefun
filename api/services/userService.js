const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const errors = require("../errors/errors");

module.exports = function(app) {

  const hash = function(clear) {
    return crypto.createHmac('sha256', app.get("salt")).update(clear).digest('hex');
  }

  const getUserByLogin = function(login, callback) {
    User.findOne({
      login: login
    }, function(err, user) {
      if (err) {
        console.error(err);
        callback(errors.NOT_FOUND);
      }
      callback(null, user)
    });
  }

  return {
    getJwt: function(creds, callback) {
      User.findOne({
        login: creds.login
      }, function(err, user) {
        if (err) {
          console.error(err);
          callback(errors.NOT_FOUND);
        }
        if (!user) {
          callback(errors.NOT_FOUND);
        } else {
          if (user.password != hash(creds.pwd)) {
            callback(errors.WRONG_CREDS);
          } else {
            const payload = {
              login: user.login,
              admin: user.admin
            };
            const token = jwt.sign(payload, app.get("superSecret"), {
              expiresIn: '1440min' //24hours
            });
            callback(null, {
              message: "Enjoy the token",
              token: token
            });
          }
        }

      });
    },

    verifyToken: function(token, callback) {
      if (token) {
        jwt.verify(token, app.get("superSecret"), function(err, decoded) {
          if (err) {
            console.error(err);
            callback(errors.WRONG_CREDS);
          } else {
            callback(null, decoded);
          }
        })
      } else {
        callback(errors.NOT_AUTH);
      }
    },

    verifyAdminToken: function(token, callback) {
      if (token) {
        jwt.verify(token, app.get("superSecret"), function(err, decoded) {
          if (err) {
            console.error(err);
            callback(errors.UNAUTHORIZED);
          } else {
            callback(null, decoded);
          }
        })
      } else {
        callback(errors.NOT_AUTH);
      }
    },

    getUsers: function(callback) {
      console.log("Get all users");
      User.find({}, function(err, users) {
        if (err) {
          console.error(err);
          callback(errors.DEFAULT);
        }
        callback(null, users);
      });
    },

    getUser: function(id, callback) {
      User.findById(
        id,
        function(err, user) {
          if (err) {
            console.error(err);
            callback(errors.NOT_FOUND);
          }
          callback(null, user);
        });

    },



    // updateUser: function(user) {
    //   console.log("Update user");
    //   User.findOneAndUpdate({
    //     login: req.params.userId
    //   }, req.body, {
    //     new: true
    //   }, function(err, user) {
    //     if (err) {
    //       res.send(err);
    //     }
    //     res.json(user);
    //   });
    // },

    createUser: function(user, callback) {
      console.log("Create user");

      if (user && user.login && user.password) {
        getUserByLogin(user.login, function(err, exists) {
          if (exists) {
            callback(errors.ALREADY_EXISTS);
          } else {
            user.password = hash(user.password);
            user.admin = false;

            const newUser = new User(user);
            newUser.save(function(err, user) {
              if (err) {
                console.error(err);
                callback(errors.DEFAULT);
              }
              callback(null, user);
            });
          }
        });
      }
    },

    deleteUser: function(userId, callback) {
      console.log("Delete user");
      User.remove({
        _id: userId
      }, function(err, user) {
        if (err) {
          console.error(err);
          callback(errors.DEFAULT);
        }
        callback(user);
      });
    }


  }

}
