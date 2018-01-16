const service = require("../services/UserService")();



exports.authenticate = function(req, res) {
  if (req.headers.authorization) {
    const b64 = req.headers.authorization.substring(6);
    const buf = Buffer.from(b64, 'base64');

    const creds = buf.toString("utf-8").split(":");
    console.log(creds);
    const login = service.getJwt({
      login: creds[0],
      pwd: creds[1]
    });
    res.json(login);
  }
  res.status(401);
}

exports.getAllUsers = function(req, res) {

};

exports.createUser = function(req, res) {

};

exports.getUser = function(req, res) {
  try {
    const user = service.getUserByLogin(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateUser = function(req, res) {

};

exports.deleteUser = function(req, res) {

};
