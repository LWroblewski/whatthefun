module.exports = function(app) {
  const user = require('../controllers/userController')(app);

  const url = app.get("apiUrl");


  // VERIFY ADMIN TOKEN MIDDLEWARE

  app.use(user.verifyAdminToken);

  // AUTHENTICATED ROUTES

  app.route(url + '/users/:userId')
    .get(user.getUser)
  //   .put(user.updateUser)
  //   .delete(user.deleteUser)
}
