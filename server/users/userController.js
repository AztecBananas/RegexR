var bcrypt = require('bcrypt-nodejs');
var User = require('./userModel');
	
	



/* function: signup
 * ----------------
 * This function allows for users to be verified for sign in. It 
 * first checks for if the username is already in use and then checks if the 
 * encrypted password matches the input using bcrypt. If the user is valid, it 
 * returns a cookie with the users username and sends back the username.
*/
var signin = function(req,res){
	User.findOne({username:req.body[0]}, function(err, data){
		if(err){
			res.send(418, err);
		} else {
			if(	bcrypt.compareSync(req.body[1], data.password)){
				res.cookie('username', data.username);
				res.status(200).send(data);
			}
			res.status(404).send();
		}
	});
};

/* function: signup
 * ----------------
 * This function allows for users to be registered in the database. It 
 * first checks for if the username is already in use and if not, adds
 * the user, encrypting the username using bcrypt. It then sends back 
 * the username as a cookie and in the response.
*/
var signup = function(req, res){
	User.findOne({username:req.body[0]}, function(err, data){
		if(data) {
			console.log('user already exists');
			res.status(418).send();
		} else {
			var hash = bcrypt.hashSync(req.body[1]);
			console.log(hash);

			var user = new User({
				username: req.body[0],
				password:hash,
				points:  Math.floor(Math.random()*1000)
			});

			user.save(function(err, result){
				if(err) res.status(404).send();
				res.cookie('username', data.username);
				res.status(200).send(result.username);
			});
		}
	});
};

var submitSolution = function(req, res) {
	var username = req.cookies.username
	User.update(
     {"username":username},
     { $push: {"questionSolved": {"qNumber": req.body.qNumber, "solved": true, "solution": req.body.solution}}, $inc: {"points": req.body.points}},
       function(err, model) {
         if(err){
        	console.log(err);
        	return res.send(err);
         }
          return res.json(model);
      });


};

var getSolutions = function(req, res) {
	var username = req.cookies.username
	User.findOne({username:username}, function(err, data){
		if(err){
		 res.status(404).send();
		} else {
			res.status(200).send(data)
		}
	})
}

var leaderboard = function(req, res){
	User.find({}, function(err, data){
		if(err) res.status(404).send();
		console.log(data);
		res.status(200).send(data);
	}).sort({totalScore:-1}).limit(10);
};



module.exports = {
	signin: signin,
	signup: signup,
	submitSolution: submitSolution,
	getSolutions: getSolutions
	leaderboard: leaderboard
}