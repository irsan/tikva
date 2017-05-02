const Bunyan = require('bunyan');
const Vasync = require('vasync');

const Model = require('../model/model');

let log = Bunyan.createLogger({ name : 'tikva:controller/CommandController'});

class CommandController {

    constructor() {
    }

    parseCommand({ text, channel_id }, user, callback) {
        if(text.match(/^add ftv$/i)) {
            return this.addFTV(user, callback);
        }
        callback(null, "Ok, your command is " + command);
    }

    addFTV(user, callback) {
        log.info("THE USER: ...... ", user);
        new Model.AuthroizedLink({
            user : user, redirect : "/s/add_ftv"
        }).save((error, link) => {
            if(error) {
                log.error("ERROR", error);
                callback(error);
            }
            callback(null, "<http://tikva.sweethope.life/auth/authorized/" + link.id +"|Click here to start>");
        });

    }

    listFTVs(text, channel, user, callback) {
        Vasync.waterfall([
            (callback) => {
                if(channel != PROPERTIES.slack.channels.leaders) {
                    return callback("Oops, only leaders are allowed to do this.");
                }

                Model.FollowUp({
                    status: 'active'
                })
            }
        ], callback);
    }

}

module.exports = CommandController;