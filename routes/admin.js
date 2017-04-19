const Bunyan = require('bunyan');
const Slack = require('slack');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/admin' });

const Model = require('../model/model');

class Admin {

    constructor() {}

    static isAdminChannel(channelId) {
        return channelId == PROPERTIES.slack.channels.admin;
    }

    processIncoming(message) {
        Vasync.waterfall([
            (callback) => {
                this.isAdminUser(message.user, callback);
            },
            (isAdmin, callback) => {
                if(!isAdmin) {
                    return callback("Sorry, you are not an admin");
                }

                callback();
            }
        ], (error) => {
            if(error) {
                //TODO: reply with error
            }

            if(message.subtype != "me_message") {
                RSMQ.sendMessage({
                    qname : PROPERTIES.redis.queues.adminMO,
                    message : JSON.stringify(message)
                }, (error, resp) => {
                    log.info("QUEUE ADMIN MO", error, resp);
                });
            } else {
                log.info("SELF MESSAGEEEEEEEEEEEEEE NO HANDLING ");
            }
        });
    }

    isAdminUser(slackid, callback) {
        Vasync.waterfall([
            (callback) => {
                Model.User.findOne({
                    slackid, status : 'active'
                }, callback);
            },
            (user, callback) => {
                if(user) {
                    if(user.administrator) {
                        return callback(null, true);
                    }

                    return callback(null, false)
                }

                if(slackid != PROPERTIES.slack.superadmin) {
                    return callback(null, false);
                }

                Slack.users.info({
                    token : TOKEN,
                    user : slackid
                }, (error, data) => {
                    if(error) {
                        return callback(error);
                    }

                    if(data.ok) {
                        new Model.User({
                            slackid         : data.user.id,
                            slackname       : data.user.name,
                            name            : data.user.real_name,
                            email           : data.user.profile.email,
                            administrator   : true,
                            profileImage    : data.user.profile.image_512,
                            role            : 'leader',
                            color           : data.user.color
                        }).save((error, user) => {
                            if(error) {
                                return callback(error);
                            }

                            callback(null, true);
                        })
                    } else {
                        callback("Fail in getting user info");
                    }
                })
            }
        ], callback);
    }
}

module.exports = Admin;