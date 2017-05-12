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
        } else if(text.match(/^set as carecell .+/)) {
            let name = text.replace('set as carecell ').trim();
            return this.setAsCarecell({ name, user, channel_id }, callback);
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

    setAsCarecell({ name, user, channel_id }, callback) {
        log.info("SET AS CARECELL ", name, user, channel_id);
        callback(null, "Ok, this is now a carecell");

        // Vasync.waterfall([
        //     (callback) => {
        //         Model.Carecell.findOne({
        //             name, status : "active"
        //         }, callback);
        //     },
        //     (carecell, callback) => {
        //         if(carecell) {
        //             context.addCarecellFailedExist = "The carecell name '" + name + "' is already in used.  Please try again.";
        //             return callback(null, carecell);
        //         }
        //
        //         new Model.Carecell({
        //             name, key : UUID()
        //         }).save((error, carecell) => {
        //             if(error) {
        //                 return callback(error);
        //             }
        //             context.addCarecellDone = "Carecell '" + name + "' is added successfully.";
        //             context.done = true;
        //             callback(null, carecell);
        //         });
        //     }
        // ], (error, carecell) => {
        //     if(error) {
        //         context.addCarecellFailed = "Oops.  Something wrong. " + error;
        //         context.done = true;
        //     }
        //     return context;
        // })
    }
}

module.exports = CommandController;