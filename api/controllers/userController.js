const errors = require("../errors/errors");
module.exports = function(app) {
  const service = require("../services/userService")(app);

  return {
    authenticate: function(req, res) {
      if (req.headers.authorization) {
        const b64 = req.headers.authorization.substring("Basic ".length);
        const buf = Buffer.from(b64, 'base64');
        const creds = buf.toString("utf-8").split(":");
        service.getJwt({
          login: creds[0],
          pwd: creds[1]
        }, function(err, obj) {
          if (err) {
            res.status(err.status).send(err.desc);
          } else {
            res.json(obj);
          }

        });
      } else {
        let err = errors.BAD_PARAMS;
        res.status(err.status).send(err.desc);
      }

    },

    verifyToken: function(req, res, next) {
      if (req.headers.authorization) {
        const token = req.headers.authorization.substring("Bearer ".length);
        service.verifyToken(token, function(err, user) {
          if (err) {
            res.status(err.status).send(err.desc);
          } else {
            req.decodedUser = user;
            next();
          }
        })
      } else {
        let err = errors.NOT_AUTH;
        res.status(err.status).send(err.desc);
      }

    },

    verifyAdminToken: function(req, res, next) {
      const token = req.headers.authorization.substring("Bearer ".length);
      service.verifyToken(token, function(err, user) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          req.decodedAdmin = user;
          next();
        }
      })
    },

    getUsers: function(req, res) {
      console.log(req.decodedUser);
      service.getUsers(function(err, users) {
        if (err) {
          res.status(err.status).send(err.desc);
        }
        res.json(users);
      });
    },

    getUser: function(req, res) {
      console.log(req.params.userId);
      service.getUser(req.params.userId, function(err, user) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          res.json(user);
        }
      })
    },

    createUser: function(req, res) {
      service.createUser(req.body, function(err, user) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          res.json(user);
        }
      });
    }

  }

}

// exports.getUser = function(req, res) {
//   try {
//     const user = service.getUserByLogin(req.params.userId);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// exports.updateUser = function(req, res) {

// };

// exports.deleteUser = function(req, res) {

// };
