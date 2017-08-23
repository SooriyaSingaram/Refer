var jwt = require('jwt-simple'); // login auth with session 

module.exports = function(auth) { // this callback function call the error msg for unauthorized error
  
  return function(req,res,next){
    next();
  }
}
