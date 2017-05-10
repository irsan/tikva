const Bunyan = require('bunyan');
const Vasync = require('vasync');

const Model = require('../model/model');

let log = Bunyan.createLogger({ name : 'tikva:controller/CommandController'});

class CommandController {

    constructor() {
    }

    parseCommand({ text, channel_id }, user, callback) {
        if(text.match(/^start$/i)) {
            return this.start(user, callback);
        }
        callback(null, "Ok, your command is " + command);
    }

    start(user, callback) {
        log.info("THE USER: ...... ", user);
        new Model.AuthroizedLink({
            user : user, redirect : "/s"
        }).save((error, link) => {
            if(error) {
                log.error("ERROR", error);
                callback(error);
            }
            callback(null, "<http://tikva.sweethope.life/auth/authorized/" + link.id +"|Click here to start>");
        });

    }
    //
    // listFollowUps(user, callback) {
    //     Vasync.waterfall([
    //         (callback) => {
    //             new Model.AuthroizedLink({
    //                 user : user, redirect : "/s/followups"
    //             }).save((error, link) => {
    //                 if(error) {
    //                     log.error("ERROR", error);
    //                     callback(error);
    //                 }
    //                 callback(null, "<http://tikva.sweethope.life/auth/authorized/" + link.id +"|Click here to view follow ups>");
    //             });
    //         }
    //     ], callback);
    // }

}

module.exports = CommandController;