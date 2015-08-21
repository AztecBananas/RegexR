var bcrypt = require('bcrypt-nodejs');
var User = require('./userModel');


/* function: signup
 * ----------------
 * This function allows for users to be verified for sign in. It 
 * first checks for if the username is already in use and then checks if the 
 * encrypted password matches the input using bcrypt. If the user is valid, it 
 * returns a cookie with the users username and sends back the username.
 */
var signin = function(req, res) {
  User.findOne({
    username: req.body[0]
  }, function(err, data) {
    if (err) {
      res.send(418, err);
    } else {
      if (bcrypt.compareSync(req.body[1], data.password)) {
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

var signup = function(req, res) {
  User.findOne({
    username: req.body[0]
  }, function(err, data) {
    if (data) {
      console.log('user already exists');
      res.status(418).send();
    } else {
      var hash = bcrypt.hashSync(req.body[1]);
      console.log(hash);

      var user = new User({
        username: req.body[0],
        password: hash,
        points: Math.floor(Math.random() * 1000),
        questionSolved: []
      });
      user.save(function(err, result) {
        if (err) res.status(404).send();
        res.status(200).json(result.username);
      });
    }
  });
};

var submitSolution = function(req, res) {
  var username = req.cookies.username;
  User.update({
      "username": username
    }, {
      $push: {
        "questionSolved": {
          "qNumber": req.body.qNumber,
          "solved": true,
          "solution": req.body.solution,
          "time": req.body.time
        }
      },
      $inc: {
        "points": req.body.points
      }
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    });
};

var getUserData = function(req, res) {
  var username = req.cookies.username;
  if (username === undefined) {
    res.status(200).send(JSON.stringify({
      username: "Anonymous",
      questionSolved: []
    }));
  } else {
    User.findOne({
      username: username
    }, function(err, data) {
      if (err) {
        res.status(404).send();
      } else {
        res.status(200).send(data);
      }
    });
  }
};

var getSolutions = function(req, res) {
  var qNumber = req.body.qNumber;
  User.aggregate([{
    $unwind: "$questionSolved"
  }, {
    $match: {
      "questionSolved.qNumber": qNumber
    }
  }, {
    $sort: {
      "questionSolved.votes": -1
    }
  }]).limit(10).exec(function(err, result) {
    if (err) {
      res.send(404).send();
    } else {
      res.status(200).send(result);
    }
  });
};

var upVote = function(req, res) {
  var userId = req.body.userId;
  var qNumber = req.body.qNumber;
  User.update({
      "_id": userId,
      "questionSolved.qNumber": qNumber
    }, {
      $inc: {
        "questionSolved.$.votes": 1
      }
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    });
};


var sortSolved = function(a, b) {
  return b.questionSolved.length - a.questionSolved.length;
};

var sortPoints = function(a, b) {
  return b.points - a.points;

};

var sortUpvotes = function(a, b) {
  var aupvotes = 0;
  var bupvotes = 0;

  for (var i = 0; i < a.questionSolved.length; i++) {
    aupvotes += a.questionSolved[i].votes;
  }

  for (var j = 0; j < b.questionSolved.length; j++) {
    bupvotes += b.questionSolved[j].votes;
  }
  return bupvotes - aupvotes;
};


/* function: addUpVoteProperties
 * -----------------------------
 * This function takes in an array and acts as a decorator function. It counts
 * the total number of votes across all the questions and adds a totalVotes property
 * to each of the individual objects. 
 * PLEASE IGNORE THE SKETCHINESS......
 */
var addUpvoteProperties = function(personArray) {
  var newArray = [];
  for (var i = 0; i < personArray.length; i++) {

    var upVotes = 0;

    for (var j = 0; j < personArray[i].questionSolved.length; j++) {
      upVotes += personArray[i].questionSolved[j].votes;
    }
    if (!upVotes) upVotes = 0;
    var newObj = {
      questionsSolved: personArray[i].questionSolved.length,
      points: personArray[i].points,
      username: personArray[i].username,
      totalVotes: upVotes
    };

    newArray.push(newObj);
  }

  return newArray;

};


var findLeaders = function(data) {
  var leaders = {};

  data.sort(sortPoints);
  leaders.points = data.slice(0, 10);
  leaders.points = addUpvoteProperties(leaders.points);

  data.sort(sortUpvotes);
  leaders.upvotes = data.slice(0, 10);
  leaders.upvotes = addUpvoteProperties(leaders.upvotes);

  data.sort(sortSolved);
  leaders.solved = data.slice(0, 10);
  leaders.solved = addUpvoteProperties(leaders.solved);

  return leaders;

};
/* function: leaderboard
 * ---------------------
 * This function returns the data needed for the leaderboard. It does this by searching 
 * the mongo database for all the users data, and then returns the top 10 users who:
 * solved the most questions, have the most points, or have the most upvotes. It returns 
 * an object with three arrays for these categories.
 */
var leaderboard = function(req, res) {
  User.find({}, function(err, data) {
    if (err) res.status(404).send();
    var leaders = findLeaders(data);
    res.status(200).send(leaders);
  });
};



module.exports = {
  signin: signin,
  signup: signup,
  submitSolution: submitSolution,
  getSolutions: getSolutions,
  leaderboard: leaderboard,
  getUserData: getUserData,
  upVote: upVote
};
