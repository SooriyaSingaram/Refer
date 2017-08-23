var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var roleSetupSchema = baseSchema.extend({
    roleId: {
        type: String
    },
    roleName: {
        type: String
    },
    roleDescription: {
        type: String
    },
    roleStatus: {
        type: String
    }
});

module.exports = mongoose.model('RoleSetup', roleSetupSchema);
module.exports.schema = roleSetupSchema;