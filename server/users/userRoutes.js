var userController = require('./userController');

module.exports = function (app) {
	app.post('/signin', userController.signin);
	app.post('/signup', userController.signup);
	app.post('/submitSolution', userController.submitSolution);
	app.post('/getSolutions', userController.getSolutions);
	app.get('/leaderboard', userController.leaderboard);
};