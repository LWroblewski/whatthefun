const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const errors = require("../errors/errors").errors;
const UserDTO = require("../dto/userDTO.js");

module.exports = function(app) {

  const hash = function(clear) {
    return crypto.createHmac('sha256', app.get("salt")).update(clear).digest('hex');
  }

  const getUserByLogin = function(login, callback) {
    User.findOne({
      login: login
    }, function(err, user) {
      console.log(user);
      if (err) {
        console.error(err);
        callback(errors.default.NOT_FOUND);
      }
      if (!user) {
        callback(errors.default.NOT_FOUND);
      } else {
        callback(null, new UserDTO(user));
      }

    });
  }

  return {
    getJwt: function(creds, callback) {
      User.findOne({
        login: creds.login
      }, function(err, user) {
        if (err) {
          console.error(err);
          callback(errors.default.NOT_FOUND);
        }
        if (!user) {
          callback(errors.default.NOT_FOUND);
        } else {
          if (user.password != hash(creds.pwd)) {
            callback(errors.auth.WRONG_CREDS);
          } else {
            const payload = {
              id: user._id,
              password: user.password
            };
            console.log(payload);
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
      console.log("VerifyToken");
      if (token) {
        jwt.verify(token, app.get("superSecret"), function(err, decoded) {
          if (err) {
            console.error(err);
            callback(errors.auth.WRONG_CREDS);
          } else {
            if (decoded && decoded.id && decoded.password) {
              User.findById(decoded.id, function(err, user) {
                if (user && (user.password === decoded.password)) {
                  callback(null, user);
                } else {
                  callback(errors.auth.WRONG_CREDS)
                }
              })
            } else {
              callback(errors.auth.WRONG_CREDS);
            }
          }
        })
      } else {
        callback(errors.auth.NOT_AUTH);
      }
    },

    verifyAdminToken: function(token, callback) {
      console.log("VerifyAdminToken");
      if (token) {
        jwt.verify(token, app.get("superSecret"), function(err, decoded) {
          if (err) {
            console.error(err);
            callback(errors.auth.WRONG_CREDS);
          } else {
            if (decoded && decoded.id && decoded.password) {
              User.findById(decoded.id, function(err, user) {
                if (user && (user.password === decoded.password)) {
                  if (user.admin) {
                    callback(null, user);
                  } else {
                    callback(errors.auth.UNAUTHORIZED);
                  }
                } else {
                  callback(errors.auth.WRONG_CREDS)
                }
              })
            } else {
              callback(errors.auth.WRONG_CREDS);
            }
          }
        })
      } else {
        callback(errors.auth.NOT_AUTH);
      }
    },

    getUsers: function(callback) {
      console.log("Get all users");
      User.find({}, function(err, users) {
        if (err) {
          console.error(err);
          callback(errors.default.DEFAULT);
        }
        const usersDto = [];
        for (let i = 0; i < users.length; i++) {
          usersDto.push(new UserDTO(users[i]));
        }
        callback(null, usersDto);
      });
    },

    getUser: function(id, callback) {
      User.findById(
        id,
        function(err, user) {
          if (err) {
            console.error(err);
            callback(errors.default.NOT_FOUND);
          }
          if (user) {
            callback(null, new UserDTO(user));
          } else {
            callback(errors.default.NOT_FOUND);
          }

        });

    },

    updateUser: function(user, isAdmin, callback) {
      console.log("Update user");

      User.findById(user._id, function(err, existing) {
        if (err) {
          console.error(err);
          callback(errors.default.DEFAULT);
        } else if (!existing) {
          callback(errors.default.NOT_FOUND);
        } else {

          // If user exists & there is no db error
          user.updated_at = Date.now();
          if (user.password) {
            user.password = hash(user.password);
          }
          if (!isAdmin && !existing.admin && user.admin) {
            callback(errors.default.FORBIDDEN);
          } else {
            User.update({
              _id: user._id
            }, user, function(err, updated) {
              if (err) {
                console.error(err);
                callback(errors.default.DEFAULT);
              }
              callback(null, null);
            });
          }
        }


      });



    },


    createUser: function(user, callback) {
      console.log("Create user");

      if (user && user.login && user.password) {
        getUserByLogin(user.login, function(err, exists) {
          if (exists) {
            callback(errors.default.ALREADY_EXISTS);
          } else {
            user.password = hash(user.password);

            const newUser = new User(user);
            newUser.save(function(err, user) {
              console.log(user);
              if (err) {
                console.error(err);
                callback(errors.default.DEFAULT);
              }
              callback(null, new UserDTO(user));
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
          callback(errors.default.DEFAULT);
        }
        callback(null, null);
      });
    }


  }

}
