var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowUp = new Schema({
    uuid            : String,
    name            : String,
    phone           : String,
    address         : String,
    oikosOf         : String,
    carecell        : { type : Schema.Types.ObjectId, ref : 'Carecell' },
    dob             : Date,
    gender          : { type : String, enum : [ 'male', 'female' ] },
    marritalStatus  : { type : String, enum : [ 'single', 'married', 'widow', 'divorce' ] },
    comments        : String,
    serviceDate     : Date,
    ftv             : { type :Boolean, default : true },
    decision        : { type : Boolean, default : false },
    sp              : { type : Schema.Types.ObjectId, ref : 'User' },
    followedUpAt    : Date,
    profileImage    : String,
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

FollowUp.index({
    uuid   : 1,
    status : 1
})

FollowUp.index({
    serviceDate : -1
});

FollowUp.index({
    status : 1
});

module.exports = mongoose.model('FollowUp', FollowUp);