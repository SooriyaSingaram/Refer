var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var overheadpriceSchema=baseSchema.extend({
      noofoverhead:{type:Number} ,
      overHeadPriceId:{type:String},
      workingDays:{type:Number},
      workingHours:{type:Number},
      totaloverheadPrice:{type:Number}
});
module.exports=mongoose.model('overheadprice',overheadpriceSchema);
module.exports.schema = overheadpriceSchema;