var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var labourcostSchema=baseSchema.extend({
      noofLabour:{type:Number} ,
      labourCostId:{type:String},
      workingDays:{type:Number},
      workingHours:{type:Number},
      totalLabourCost:{type:Number}
});
module.exports=mongoose.model('labourcost',labourcostSchema);
module.exports.schema = labourcostSchema;