var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var requestTypeSchema = baseSchema.extend({
    requestId: {
        type: String
    },
    requestName: {
        type: String
    }
});
module.exports = mongoose.model('requestType', requestTypeSchema);
module.exports.schema = requestTypeSchema;