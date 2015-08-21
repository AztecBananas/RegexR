var userController = require('./userController');

module.exports = function(app) {
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.post('/submitSolution', userController.submitSolution);
  app.post('/getSolutions', userController.getSolutions);
  app.get('/leaderboard', userController.leaderboard);
  app.post('/getUserData', userController.getUserData);
  app.get('/getUserData', userController.getUserData);
  app.post('/upVote', userController.upVote);
  app.get('/getUserData', userController.getUserData);
};
