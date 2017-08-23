var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var menucategorySchema=baseSchema.extend({
      categoryName:{type:String} ,
      categoryId:{type:String}
});
module.exports=mongoose.model('menucategory',menucategorySchema);
module.exports.schema = menucategorySchema;