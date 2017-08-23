var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var menuSchema = baseSchema.extend({
    menuId: {
        type: String
    },
    itemName: {
        type: String
    },
    servingSize: {
        type: String
    },
    avgTime: {
        type: Number
    },
    menucategoryId: {
        type: String
    },
    costPrice: {
        type: Number
    },
    sellingPrice: {
        type: Number
    },
    recipe: {
        type: String
    },
    unitId: {
        type: String
    },
    ingredients: [{
        productId: {
            type: String
        },
        productName: {
            type: String
        },
        unitId: {
            type: String
        },
        qty: {
            type: Number
        },
        price: {
            type: Number
        }

    }],
    photos: {
        type: Object
    },
    outletPrice: {
        type: Number
    },
    recipe: {
        type: String
    },
    labourCostId:{
        type: String
    },
    overHeadPriceId : {
        type: String
    },
    createdby: {
        type: String
    }

});

module.exports = mongoose.model('Menu', menuSchema);
module.exports.schema = menuSchema;