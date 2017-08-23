var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var outletSchema = baseSchema.extend({
    branchId: {
        type: String
    },
    branchName: {
        type: String
    },
    address: {
        type: String
    },
    code: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    outletType: {
        type: Object
    },
    outletStatus: {
        type: String
    },

    emergencyContactName: {
        type: String
    },
    emergencyCode: {
        type: String
    },
    emergencyMobileNo: {
        type: Number
    },
    bankName: {
        type: String
    },
    bankAc: {
        type: String
    },
    lanlordName:{
         type: String
     },
    lanlordCode: {
        type: String
    },
    lanlordMobileNo: {
        type: Number
    },

});
module.exports = mongoose.model('Outlet', outletSchema);
module.exports.schema = outletSchema;