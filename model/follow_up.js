var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowUp = new Schema({
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
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

module.exports = mongoose.model('FollowUp', FollowUp);