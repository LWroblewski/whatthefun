module.exports = function(app) {
  const user = require('../controllers/userController')(app);

  const url = app.get("apiUrl");


  // UNAUTHENTICATED ROUTES

  app.route('/login')
    .get(user.authenticate);

  app.route(url + "/users")
    .post(user.createUser);
}
