const errors = require("../errors/errors").errors;
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
        let err = errors.default.BAD_PARAMS;
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
            if (user.admin) {
              req.decodedAdmin = user;
            }
            console.log("AUTH ---");
            console.log(req.decodedUser);
            console.log("--- /AUTH");
            next();
          }
        })
      } else {
        let err = errors.auth.NOT_AUTH;
        res.status(err.status).send(err.desc);
      }
    },

    verifyAdminToken: function(req, res, next) {
      const token = req.headers.authorization.substring("Bearer ".length);
      service.verifyAdminToken(token, function(err, user) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          req.decodedAdmin = user;
          console.log("ADMIN ---");
          console.log(req.decodedUser);
          console.log("--- /ADMIN");
          next();
        }
      })
    },

    getUsers: function(req, res) {
      service.getUsers(function(err, users) {
        if (err) {
          res.status(err.status).send(err.desc);
        }
        res.json(users);
      });
    },

    getUser: function(req, res) {
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
          res.status(201).json(user);
        }
      });
    },

    deleteUser: function(req, res) {
      service.deleteUser(req.params.userId, function(err, user) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          res.status(204).send();
        }
      })
    },

    updateUser: function(req, res) {
      if ((req.decodedUser && (req.decodedUser._id == req.params.userId)) || req.decodedAdmin) {
        req.body._id = req.params.userId;
        service.updateUser(req.body, req.decodedUser.admin, function(err, user) {
          if (err) {
            res.status(err.status).send(err.desc);
          } else {
            res.status(204).json();
          }
        });
      } else {
        console.log(errors.default.FORBIDDEN);
        let err = errors.default.FORBIDDEN;
        res.status(err.status).send(err.desc);
      }
    }

  }

}
