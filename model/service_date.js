var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceDate = new Schema({
    date            : Date,
    followUpCount   : { type : Number, default : 0 },
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

ServiceDate.index({ date : -1 });
ServiceDate.index({ status : 1 });
ServiceDate.index({ date : 1, status : 1 });

module.exports = mongoose.model('ServiceDate', ServiceDate);