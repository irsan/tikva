var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowUpNote = new Schema({
    entry           : String,
    followUp        : { type : Schema.Types.ObjectId, ref : 'FollowUp' },
    sp              : { type : Schema.Types.ObjectId, ref : 'User' },
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

FollowUpNote.index({
    followUp    : 1,
    status      : 1
})

FollowUpNote.index({
    createdAt : -1
});

module.exports = mongoose.model('FollowUpNote', FollowUpNote);