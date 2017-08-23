var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var invoiceSchema = baseSchema.extend({
    purchaseOrderId: {
        type: String
    },
    invoiceNo: {
        type: String
    },
    branchId: {
        type: String
    },
    supplierId: {
        type: String
    },
    status: {
        type: String
    },
    subTotal: {
        type: Number
    },
    receipt: {
        type: Object
    },
    payments: [{
        date: {
            type: Date
        },
        paidAmount: {
            type: Number
        },
        balance: {
            type: Number
        }
    }],
    productDetails: {
        type: Object
    },
    menuDetails: {
         type: Object
    },
    gst:{
        type: Number
    },
    totalAmount:{
        type: Number
    },
    invoiceId:{
        type: String
    },
    supplier:{
        type: Boolean
    },
    franchise: {
        franchise: {
            type: Boolean
        },
        franchiseId: {
            type: String
        }
    }
});
module.exports = mongoose.model('Invoice',invoiceSchema);
module.exports.schema = invoiceSchema;