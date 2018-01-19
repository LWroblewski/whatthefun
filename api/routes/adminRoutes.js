module.exports = function(app) {
  const user = require('../controllers/userController')(app);
  const team = require('../controllers/teamController')(app);
  const event = require('../controllers/eventController')(app);

  const url = app.get("apiUrl");


  // VERIFY ADMIN TOKEN MIDDLEWARE

  app.use(user.verifyAdminToken);

  // AUTHENTICATED ROUTES


  app.route(url + "/users")
    .post(user.createUser);
  app.route(url + '/users/:userId')
    .delete(user.deleteUser);
  app.route(url + '/teams')
    .post(team.createTeam)
}
