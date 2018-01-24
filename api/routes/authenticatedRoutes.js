module.exports = function(app) {
  const user = require('../controllers/userController')(app);
  const team = require('../controllers/teamController')(app);
  const event = require('../controllers/eventController')(app);

  const url = app.get("apiUrl");


  // VERIFY TOKEN MIDDLEWARE

  app.use(user.verifyToken);

  // AUTHENTICATED ROUTES


  app.route(url + '/users')
    .get(user.getUsers)

  app.route(url + '/users/:userId')
    .get(user.getUser)
    .put(user.updateUser);

  app.route(url + '/teams')
    .get(team.getTeams);

  app.route(url + '/teams/:teamId')
    .get(team.getTeam);
  app.route(url + '/teams/:teamId/members')
    .post(team.addUserInTeam)
    .delete(team.removeUserFromTeam);

  app.route(url + '/events')
    .get(event.getEvents)
    .post(event.createEvent);

  app.route(url + '/events/:eventId')
    .get(event.getEvent);

  app.route(url + '/events/:eventId/comments')
    .post(event.commentEvent);
}
