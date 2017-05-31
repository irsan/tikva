const Bunyan = require('bunyan');
const UUID = require('uuid');
const Vasync = require('vasync');

const Model = require('../model/model');

let log = Bunyan.createLogger({ name : 'tikva:controller/CommandController'});

class CommandController {

    constructor() {
    }

    parseCommand({ text, channel_id }, user, callback) {
        if(text.match(/^start$/i)) {
            return this.start(user, callback);
        } else if(text.match(/^set as carecell .+$/i)) {
            let name = text.replace(/^set as carecell /i, '').trim();
            return this.setAsCarecell({ name, user, channel_id }, callback);
        } else if(text.match(/^add sp .+ to carecell .+$/i)) {
            return this.addSP({ text }, callback);
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

        Vasync.waterfall([
            (callback) => {
                if(!user.administrator) {
                    return callback("You are not an administrator.");
                }

                Model.Carecell.count({
                    name, status : "active"
                }, callback);
            },
            (count, callback) => {
                if (count > 0) {
                    return callback("The carecell name '" + name + "' is already in used.  Please try again.");
                }

                Model.Carecell.findOne({
                    slackChannel : channel_id, status : "active"
                }).select('name').exec(callback);
            },
            (carecell, callback) => {
                if (carecell) {
                    return callback("This group is already a carecell called '" + carecell.name +"'.");
                }


                new Model.Carecell({
                    name, key : 'cc-' + UUID.v1()
                }).save((error, carecell) => {
                    if(error) {
                        return callback(error);
                    }
                    callback(null, carecell);
                });
            }
        ], (error, carecell) => {
            if(error) {
                return callback(error);
            }

            callback(null, "This group is now a Carecell '" + carecell.name + "'.");
        });
    }

    addSP({ text }, callback) {

        Vasync.waterfall([
            (callback) => {
                // add sp .+ to carecell .+
                let input = text.split(" to carecell ");
                if(input.length < 2) {
                    return callback("Please specify SP and Carecell");
                }

                callback(null, input);
            },
            (input, callback) => {
                let spInfo = input[0].trim().replace("add sp ", "");
                let carecellName = new RegExp(input[1].trim(), "i");

                Model.Carecell.findOne({
                    name : { $regex : carecellName },
                    status : 'active'
                }, (error, carecell) => {
                    if(error) {
                        return callback(error);
                    }

                    if(!carecell) {
                        return callback("Invalid Carecell");
                    }

                    callback(null, { spInfo, carecell });
                });
            },
            ({ spInfo, carecell }, callback) => {
                log.info("SP INFO IS", spInfo, carecell);
                spInfo = spInfo.split(',');
                if(spInfo.length < 2) {
                    return callback("Please provide with name,email for the SP info when you add.");
                }

                callback(null, "SP ADDED");
            }
        ], (error, message) => {
            if(error) {
                return callback(error);
            }

            callback(null, message);
        });
    }
}

module.exports = CommandController;