var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");//Inherits base schema which is for Id and time when creation of data.
var inventorySettingSchema = baseSchema.extend({
    inventoryId: {
        type: String
    },
    outletType: {
        type:String
    },
    listOfProducts: [{
    	productId :{type: String},
    	avilableQuantity :{type: Number},
        pId:{type:String}
    
    }]
});

module.exports=mongoose.model('Inventorysetting',inventorySettingSchema);
module.exports.schema = inventorySettingSchema;
