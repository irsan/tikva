var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorizedLink = new Schema({
    url             : String,
    redirect        : String,
    user            : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt       : { type : Date, default : Date.now, expires : 60 },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

AuthorizedLink.index({
    url : 1, status : 1
});

module.exports = mongoose.model('AuthorizedLink', AuthorizedLink);