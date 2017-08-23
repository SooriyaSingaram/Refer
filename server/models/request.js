var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var requestSchema = baseSchema.extend({
    reqId: {
        type: String
    },
    outletId: {
        type: String
    },
    franchiseId: {
        type: String
    },
    description: {
        type: String
    },
    requestTypeId: {
        type: String
    },
    raisedDate: {
        type: Date
    },
    raisedBy: {
        type: String
    }

});

module.exports = mongoose.model('Request', requestSchema);
module.exports.schema = requestSchema;