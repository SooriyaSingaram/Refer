/**
 * Passport Router
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Employee = require('../models/employee');

passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  },
  function(username, password, done) {
    Employee.findOne({ userName: username }, function(err, employee) {
      if (err) { return done(err); }
      // Return if employee not found in database
      if (!employee) {
        return done(null, false, {
          message: 'Sorry, Komalas doesn t recognize that email.'
        });
      }
      // Return if password is wrong
      if (!employee.validPassword(password)) {
        return done(null, false, {
          message: 'Wrong password. Try again.'
        });
      }
      // If credentials are correct, return the user object
      return done(null, employee);
    });
  }
));