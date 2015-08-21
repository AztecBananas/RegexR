var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var morgan = require('morgan');
var userRoutes = require('../users/userRoutes');
var questionRoutes = require('../questions/questionRoutes');

module.exports = function(app) {

  app.use(bodyParser.json());

  //Allows for the use of cookies for authentication
  app.use(cookieParser());

  //Logging middleware which allows all requests to be visible in the terminal
  app.use(morgan());


  app.use(express.static(__dirname + '/../../client/'));

  userRoutes(app);
  questionRoutes(app);
};
