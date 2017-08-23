var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var nationalitySchema= baseSchema.extend({
    nationalityId:{type:String},
    // nationalityCode:{type:String},
    nationalityName:{type:String} 
});

module.exports=mongoose.model('Nationality',nationalitySchema);
module.exports.schema = nationalitySchema;
