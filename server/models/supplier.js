var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var supplierSchema = baseSchema.extend({
    supplierId: {
        type: String
    },
    supplierName: {
        type: String
    },
    gst: {
        type: Boolean
    },
    gstNumber: {
        type: String
    },
    email: {
        type: String
    },
    code: {
        type: String
    },
    phnNo: {
        type: Number
    },
    supplierAddress: {
        type: String
    },
    primaryCode: {
        type: String
    },
    primaryEmail: {
        type: String
    },
    primaryPhnNo: {
        type: Number
    },
    secondaryCode: {
        type: String
    },
    secondaryEmail: {
        type: String
    },
    secondaryPhnNo: {
        type: Number
    },
    creditPeriod: {
        type: Number
    },
    deliveryTime: {
        type: Number
    },
    expiryDays: {
        type: Number
    },
    salesName: {
        type: String
    },
    salesCode: {
        type: String
    },
    salesPhnNo: {
        type: Number
    },
    companyFax: {
        type: Number
    }
});

module.exports = mongoose.model('Supplier', supplierSchema);
module.exports.schema = supplierSchema;