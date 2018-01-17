module.exports = function(app) {
  const user = require('../controllers/userController')(app);

  const url = app.get("apiUrl");


  // VERIFY TOKEN MIDDLEWARE

  app.use(user.verifyToken);

  // AUTHENTICATED ROUTES

  app.route(url + '/users')
    .get(user.getUsers)

  //   .post(user.createUser)

  app.route(url + '/users/:userId')
    .get(user.getUser)
  //   .put(user.updateUser)
  //   .delete(user.deleteUser)
}
