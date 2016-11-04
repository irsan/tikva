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


// {
//     "object": "page",
//     "entry": [{
//     "id": "738948569577541",
//     "time": 1478244282225,
//     "messaging": [{
//         "sender": {
//             "id": "1264623113558926"
//         },
//         "recipient": {
//             "id": "738948569577541"
//         },
//         "timestamp": 1478244282120,
//         "message": {
//             "mid": "mid.1478244282120:e70e83f951",
//             "seq": 32,
//             "text": "hi 6"
//         }
//     }]
// }]
// }