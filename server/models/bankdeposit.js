var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var bankDepositSchema = baseSchema.extend({
    branchId: {
        type: String
    },
    Date: {
        type: Date
    },
    depositAmount: {
        type: Number
    },
    depositDate: {
        type: Date
    },
    bankName: {
        type: String
    },
    bankAc: {
        type: String
    },
    receipt: {
        type: Object
    },
    reason: {
        type: String
    },
    franchise: {
        franchise: {
            type: Boolean
        },
        franchiseId: {
            type: String
        }
    },
    depositId: {
        type: String
    }

});

module.exports = mongoose.model('bankDeposit', bankDepositSchema);
module.exports.schema = bankDepositSchema;