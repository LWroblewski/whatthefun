module.exports = function(app){
  const user = require('../controllers/userController');

  app.route('/users')
  .get(user.getAllUsers)
  .post(user.createUser)

  app.route('/users/:userId')
  .get(user.getUser)
  // .put(user.updateUser)
  // .delete(user.deleteUser)
};

