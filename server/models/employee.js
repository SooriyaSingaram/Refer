var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var crypto = require('crypto');
var jwt =require('jwt-simple');
var baseSchema = require("./base.js");
var employeeSchema = baseSchema.extend({
    employeeId: {
        type: String
    },
    address: {
        type: String
    },
    branchId: {
        type: String
    },
    code: {
        type: String
    },
    employeeName: {
        type: String
    },
    role: {
        type:String
    },
    gender: {
        type: String
    },
    nationality: {
        type: String
    },
    nricNo: {
        type: String
    },
    nricType: {
        type: String
    },
    hashed_pwd: {
        type: String
    },
    phoneNo: {
        type: Number
    },
    residentialNo: {
        type: Number
    },
    residentailStatus: {
        type: String
    },
    status: {
        type: String
    },
    userName: {
        type: String
    },
    salt: {
        type: String
    }

});

employeeSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashed_pwd = crypto.createHmac('sha256', this.salt)
                   .update(password)
                   .digest('hex')
};
employeeSchema.methods.validPassword = function(password) {
  var hash = crypto.createHmac('sha256', this.salt)
                   .update(password)
                   .digest('hex');
  return this.hashed_pwd === hash;
};
employeeSchema.methods.generateJwt = function() {
 var d = new Date();

var calculatedExpiresIn = (((d.getTime()) + (60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);

  return jwt.encode({
    _id: this._id,
    userName: this.userName,
    role:this.role,
    branchId :this.branchId,
    employeeName : this.employeeName,
    employeeId : this.employeeId,
    branchId : this.branchId,
   // exp: parseInt(expiry.getTime()/1000),
   exp: calculatedExpiresIn,
  }, '123456ABCDEF');
};
module.exports = mongoose.model('Employee', employeeSchema);
module.exports.schema = employeeSchema;