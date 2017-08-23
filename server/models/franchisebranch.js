var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var franchisebranchSchema = baseSchema.extend({
    branchId: {
        type: String
    },
    branchName: {
        type: String
    },
    franchiseId: {
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
    status: {
        type: String
    },
    bankName: {
        type: String
    },
    bankAc: {
        type: String
    },
    storageDetails: [{
        storageArea: {
            type: String
        }
    }],
    emergencyContactName: {
        type: String
    },
    emergencyCode: {
        type: String
    },
    emergencyMobileNo: {
        type: Number
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

module.exports = mongoose.model('FranchiseBranch', franchisebranchSchema);
module.exports.schema = franchisebranchSchema;