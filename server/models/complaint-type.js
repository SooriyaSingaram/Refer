var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var complaintTypeSchema = baseSchema.extend({
    complaintId: {
        type: String
    },
    complaintName: {
        type: String
    }
});

module.exports = mongoose.model('complaintType', complaintTypeSchema);
module.exports.schema = complaintTypeSchema;