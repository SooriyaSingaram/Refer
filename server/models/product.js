var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var productSchema = baseSchema.extend({
    productId: {
        type: String
    },
    productName: {
        type: String
    },
    categoryId: {
        type: String
    },
    subCategoryId: {
        type: String
    },
    productDescription: {
        type: String
    },
    centralizedKitchen: {
        type: Boolean
    },
    shelfLife: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    productCode:{
         type: String
    },
    batchNumber: {
        type: String
    },
    unitId: {
        type: String
    },
    outletPrice: {
        type: Number
    },
    unitConversion: [{
        from: {
            type: Number
        },
        to: {
            type: Number
        },
        toUnit: {
            type: String
        }
    }],
    supplierDetails: [{
        suppliername: {
            type: String
        },
        defaultsupplier: {
            type: String
        },

        price: {
            type: Number
        },

        id: {
            type: String
        }

    }],
    maxQtyPO: {
        type: Number
    },
    minWarehouseQty: {
        type: Number
    },
    maxWarehouseQty: {
        type: Number
    },
    defaultSupplier: {
        type: String
    },
    averagePrice: {
        type: Number
    },
    status:{
           type: String
    },
    minCentralizedQty:{
          type: Number
    },
     maxCentralizedQty:{
           type: Number
     }

});

module.exports = mongoose.model('Product', productSchema);
module.exports.schema = productSchema;