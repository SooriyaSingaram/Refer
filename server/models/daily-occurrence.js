var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var dailyOccurrenceSchema = baseSchema.extend({
    dailyOccurrenceId: {
        type: String
    },
    outletId: {
        type: String
    },
    branchName: {
        type: String
    },
    complaintId: {
        type: String
    },
    reportDate: {
        type: Date
    },
    description: {
        type: String
    },
    reportedBy: {
        type: String
    },
    priorityLevel: {
        type: String
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

module.exports = mongoose.model('DailyOccurrence', dailyOccurrenceSchema);
module.exports.schema = dailyOccurrenceSchema;