module.exports = function(app) {
  const user = require('../controllers/userController')(app);
  const file = require('../controllers/fileController')(app);

  const url = app.get("apiUrl");


  // UNAUTHENTICATED ROUTES

  app.route('/login')
    .get(user.authenticate);

    
  app.route('/file/:id')  
    .get(file.getFile)

  // app.route(url + "/users")
  //   .post(user.createUser);

}
