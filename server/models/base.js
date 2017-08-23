var mongoose = require('mongoose');

//This is the base schema all other schema should derive from
var baseSchema = mongoose.Schema({
    createdDateTime: {
        type: Date,
        default: Date.now
    },
    modifiedDateTime: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false
});

baseSchema.pre('save', function(next) {

    //only update the ModifiedDateTime if this is not a new record, otherwise let it
    //use the default so that Created and Modified match.
    if (this._id !== null)
        this.modifiedDateTime = Date.now();

    next();
});

module.exports = baseSchema;