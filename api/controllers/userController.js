const errors = require("../errors/errors").errors;
module.exports = function(app) {
  const service = require("../services/userService")(app);

  return {
    authenticate: async function(req, res) {
      if (req.headers.authorization) {
        try {
          const b64 = req.headers.authorization.substring("Basic ".length);
          const buf = Buffer.from(b64, 'base64');
          const creds = buf.toString("utf-8").split(":");
          let pwd;
          if (creds.length > 2) {
            let tempPwd = [];
            for (let i = 1; i < creds.length; i++) {
              tempPwd.push(creds[i]);
            }
            pwd = tempPwd.join(':');
          } else {
            pwd = creds[1];
          }
          const jwt = await service.getJwt({
            login: creds[0],
            pwd: pwd
          });
          res.json(jwt);
        } catch (e) {
          res.status(e.status).send(e.desc);
        }

      } else {
        let err = errors.default.BAD_PARAMS;
        res.status(err.status).send(err.desc);
      }
    },

    verifyToken: async function(req, res, next) {
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.substring("Bearer ".length);
          const user = await service.verifyToken(token);
          req.decodedUser = user;

          if (user.admin) {
            req.decodedAdmin = user;
          }
          next();
        } catch (e) {
          res.status(e.status).send(e.desc);
        }
      } else {
        let err = errors.auth.NOT_AUTH;
        res.status(err.status).send(err.desc);
      }
    },

    verifyAdminToken: async function(req, res, next) {
      try {
        const token = req.headers.authorization.substring("Bearer ".length);
        const user = await service.verifyAdminToken(token);
        req.decodedAdmin = user;
        next();
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    getUsers: async function(req, res) {
      try {
        const users = await service.getUsers();
        res.json(users);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    getUser: async function(req, res) {
      try {
        const user = await service.getUser(req.params.userId);
        res.json(user);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    /**
     * @api {post} /api/users Create a new User
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiParam {String} login User login (mail address)
     * @apiParam {String} password User password (will be hashed)
     * @apiParam {String} [firstname] User firstname
     * @apiParam {String} [lastname] User lastname
     * @apiParam {Date} [birthdate] User date of birth
     * @apiParam {Boolean} [admin=false] Is the User an admin or not
     *
     * @apiSuccess {String} id User id
     * @apiSuccess {String} login User login
     * @apiSuccess {String} [firstname] User firstname
     * @apiSuccess {String} [lastname] User lastname
     * @apiSuccess {Date} [birthdate] User date of birth
     * @apiSuccess {String} [team] User team ID
     * @apiSuccess {Boolean} [admin] Is the User an admin or not
     */
    createUser: async function(req, res) {
      try {
        const newUser = await service.createUser(req.body);
        res.json(newUser);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    deleteUser: async function(req, res) {
      try {
        const result = await service.deleteUser(req.params.userId);
        res.status(204).send();
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    /**
     * @api {put} /api/users/:id Update an User
     * @apiName UpdateUser
     * @apiGroup User
     *
     * @apiParam {String} id User id
     * @apiParam {String} [login] User login (mail address)
     * @apiParam {String} [password] User password (will be hashed)
     * @apiParam {String} [firstname] User firstname
     * @apiParam {String} [lastname] User lastname
     * @apiParam {Date} [birthdate] User date of birth
     * @apiParam {Boolean} [admin=false] Is the User an admin or not
     *
     * @apiSuccess (204)
     */
    updateUser: async function(req, res) {
      if ((req.decodedUser && (req.decodedUser._id == req.params.userId)) || req.decodedAdmin) {
        req.body._id = req.params.userId;

        try {
          const user = await service.updateUser(req.body, req.decodedUser.admin);
          res.status(204).send();
        } catch (e) {
          res.status(e.status).send(e.desc);
        }

      } else {
        let err = errors.default.FORBIDDEN;
        res.status(err.status).send(err.desc);
      }
    }

  }

}
