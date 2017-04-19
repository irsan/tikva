var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    slackid         : String,
    slackname       : String,
    name            : String,
    mobile          : String,
    email           : String,
    administrator   : { type : Boolean, default : false },
    profileImage    : { type: String, default : "https://s3-ap-southeast-1.amazonaws.com/jie-tikva/user.svg" },
    carecell        : { type : Schema.Types.ObjectId, ref : 'Carecell' },
    role            : { type : String, default : 'sp' },
    color           : String,
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

User.index({
    email : 1,
    status : 1
});

User.index({
    slackid : 1,
    status : 1
});

User.index({
    carecell : 1,
    status : 1
});

module.exports = mongoose.model('User', User);