/**
 * login controller
 */
var passport = require('passport');
var mongoose = require('mongoose');
var Employee = require('../models/employee');

/**
 * login function is used to check wheater authenticate user or not.
 */
module.exports.login = function(req, res) {
  
  passport.authenticate('local', function(err, employee, info) {// passport is used to authenticate the user credentials 
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a employee is found
    if (employee) {
      token = employee.generateJwt();
      res.status(200);
      res.json({
        "access_token": token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};