const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const errors = require("../errors/errors").errors;
const UserDTO = require("../dto/userDTO.js");
const Team = require("../models/teamModel");

module.exports = function(app) {

  const hash = function(clear) {
    return crypto.createHmac('sha256', app.get("salt")).update(clear).digest('hex');
  }

  const getUserByLogin = async function(login) {
    try {
      const user = await User.findOne({
        login: login
      });
      return new UserDTO(user);
    } catch (e) {
      throw errors.default.NOT_FOUND;
    }
  }

  return {
    getJwt: async function(creds) {
      let isValid = true;
      try {
        const user = await User.findOne({
          login: creds.login
        });
        if (user.password != hash(creds.pwd)) {
          isValid = false;
          throw errors.default.WRONG_CREDS;
        }
        const payload = {
          id: user._id,
          password: user.password
        }
        console.log(payload);
        const token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: '1440min'
        });
        return {
          message: "Enjoy the token",
          login: user.login,
          token_type: "Bearer",
          expires_in: 86400,
          token: token
        }

      } catch (e) {
        if (!isValid) {
          throw e;
        }
        throw errors.default.NOT_FOUND;
      }
    },

    verifyToken: async function(token) {
      console.log("VerifyToken");
      if (token) {
        try {
          const decoded = jwt.verify(token, app.get("superSecret"));
          if (decoded && decoded.id && decoded.password) {
            const user = await User.findById(decoded.id);
            if (user && (user.password === decoded.password)) {
              return new UserDTO(user);
            } else {
              throw errors.auth.WRONG_CREDS;
            }
          } else {
            throw errors.auth.WRONG_CREDS;
          }

        } catch (e) {
          throw errors.auth.WRONG_CREDS;
        }
      } else {
        throw errors.auth.NOT_AUTH;
      }


    },

    verifyAdminToken: async function(token) {
      console.log("VerifyAdminToken");
      if (token) {
        let isAdmin = true;
        try {
          const decoded = await jwt.verify(token, app.get("superSecret"));
          if (decoded && decoded.id && decoded.password) {
            try {
              const user = await User.findById(decoded.id);
              if (user && (user.password === decoded.password)) {
                if (user.admin) {
                  return new UserDTO(user);
                } else {
                  isAdmin = false;
                  throw errors.auth.UNAUTHORIZED;
                }
              }
            } catch (er) {
              throw errors.auth.WRONG_CREDS;
            }

          } else {
            throw errors.auth.WRONG_CREDS;
          }
        } catch (e) {
          if (!isAdmin) {
            throw e;
          }
          throw errors.auth.WRONG_CREDS;
        }
      } else {
        throw errors.auth.NOT_AUTH;
      }
    },

    getUsers: async function() {
      try {
        const users = await User.find({});
        const usersDto = [];
        for (let i = 0; i < users.length; i++) {
          usersDto.push(new UserDTO(users[i]));
        }
        return usersDto;
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    getUser: async function(id) {
      try {
        const user = await User.findById(id);
        return new UserDTO(user);
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    },

    updateUser: async function(user, isAdmin) {
      console.log("Update user");
      let forbidden = false;
      let defaultErr = false;
      try {
        const existing = await User.findById(user._id);
        user.updated_at = Date.now();
        if (user.password) {
          user.password = hash(user.password);
        }
        if (!isAdmin && !existing.admin && user.admin) {
          forbidden = true;
          throw errors.default.FORBIDDEN;
        }
        try {
          const updated = await User.update({
            _id: user._id
          }, user);
          return new UserDTO(updated);
        } catch (err) {
          defaultErr = true;
          console.error(err);
          throw errors.default.DEFAULT;
        }

      } catch (e) {
        if (forbidden) {
          throw e;
        }
        if (defaultErr) {
          throw e;
        }
        throw errors.default.NOT_FOUND;
      }

    },


    createUser: async function(user) {
      if (user && user.login && user.password) {
        let exists = false;
        try {
          const existingUser = await getUserByLogin(user.login);
          exists = true;
          throw errors.default.ALREADY_EXISTS;
        } catch (e) {
          if (exists) {
            throw e;
          } else {
            user.password = hash(user.password);
            const newUser = new User(user);
            const result = await newUser.save();
            return new UserDTO(result);
          }
        }
      }
    },

    deleteUser: async function(userId) {
      console.log("Delete user");
      const result = await User.remove({
        _id: userId
      });
      return;
    }


  }

}
