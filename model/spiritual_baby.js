var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpiritualBaby = new Schema({
    name            : String,
    profileImage    : { type : String, default : "https://jie-tikva.s3-ap-southeast-1.amazonaws.com/user.svg" },
    oikosOf         : String,
    carecell        : { type : Schema.Types.ObjectId, ref : 'Carecell' },
    sp              : { type : Schema.Types.ObjectId, ref : 'User' },
    visitDate       : Date,
    ftv             : { type : Boolean, default : true },
    decision        : { type : Boolean, default : false },
    contacted       : { type : Boolean, default : false },
    returned        : { type : Boolean, default : false },
    nb              : { type : Boolean, default : false },
    nurtured        : { type : Boolean, default : false },
    comments        : String,
    mobile          : String,
    address         : String,
    email           : String,
    gender          : String, //f or m
    marritalStatus  : String, //single, married, divorced, widower or widow
    uploadefFiles   : [ { type : Schema.Types.ObjectId, ref : 'UploadedFile' } ],
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

SpiritualBaby.index({ carecell       : 1 });
SpiritualBaby.index({ sp             : 1 });
SpiritualBaby.index({ visitDate      : 1 });
SpiritualBaby.index({ type           : 1 });
SpiritualBaby.index({ contacted      : 1 });
SpiritualBaby.index({ returned       : 1 });
SpiritualBaby.index({ nb             : 1 });
SpiritualBaby.index({ nurtured       : 1 });
SpiritualBaby.index({ createdAt      : 1 });
SpiritualBaby.index({ updatedAt      : 1 });
SpiritualBaby.index({ creator        : 1 });
SpiritualBaby.index({ updater        : 1 });
SpiritualBaby.index({ status         : 1 });

module.exports = mongoose.model('SpiritualBaby', SpiritualBaby);