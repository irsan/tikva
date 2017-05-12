var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Carecell = new Schema({
    name            : String,
    key             : String,
    ftvCount        : { type : Number, default : 0 },
    decisionCount   : { type : Number, default : 0 },
    profileImage    : { type : String, default : "https://jie-tikva.s3-ap-southeast-1.amazonaws.com/carecell.svg" },
    slackChannel    : String,
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});


Carecell.index({
    name   : 1,
    status : 1
});

Carecell.index({
    name: 1
});

Carecell.index({
    key    : 1,
    status : 1
});

Carecell.index({
    slackChannel : 1,
    status       : 1
});

module.exports = mongoose.model('Carecell', Carecell);