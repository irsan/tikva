const Bunyan = require('bunyan');
const Model = require('../models/model');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:controller.MessageController' });

function MessageController() {
}

MessageController.parse = (data, callback) => {
    Vasync.waterfall([
        (callback) => {//get user
            if(data.object != "page" && data.entry.length == 0) {
                return callback("Parse body failed");
            }

            var messaging = data.entry[0].messaging[0];
        }
    ], callback);
};

module.exports = MessageController;