const Bunyan = require('bunyan');
const Slack = require('slack');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/TikvaAdmin' });

const Model = require('../model/model');

const Bot = require('./bot');

class TikvaAdminBot extends Bot {

    constructor(params) {
        super(params);
        this.username = "tikva_admin";
    }

    processIncoming(message, callback) {
        let bot = this;

        log.info("THE MESSAGE RECEIVED:", message);
        Vasync.waterfall([
            (callback) => {
                bot.isAdminUser(message.user, callback);
            },
            (user, callback) => {
                bot.queueMO({ user, message }, callback);
            }
        ], (error, resp) => {
            log.info("QUEUE ADMIN MO", error, resp);
        })
    }

    isAdminUser(slackid, callback) {
        let token = this.token;

        Vasync.waterfall([
            (callback) => {
                if(PROPERTIES.slack.administrators.indexOf(slackid) < 0) {
                    return callback("Sorry, you are not an administrator");
                }

                Slack.users.info({
                    token,
                    user : slackid
                }, callback);
            },
            (slackData, callback) => {
                if(slackData.ok) {
                    Model.User.findOne({ slackid, status : 'active' }, (error, user) => {
                        if(error) {
                            return callback("Oops, " + error);
                        }

                        if(!user) {
                            new Model.User({
                                slackid         : slackData.user.id,
                                slackname       : slackData.user.name,
                                name            : slackData.user.real_name,
                                email           : slackData.user.profile.email,
                                administrator   : true,
                                profileImage    : slackData.user.profile.image_512,
                                color           : slackData.user.color
                            }).save((error, user) => {
                                if(error) {
                                    return callback(error);
                                }

                                callback(null, user);
                            })
                        } else {
                            user.name = slackData.user.real_name;
                            user.email = slackData.user.profile.email;
                            user.administrator = true;
                            user.profileImage = slackData.user.profile.image_512;
                            user.color = slackData.user.color;
                            user.save();
                            callback(null, user);
                        }
                    });
                } else {
                    callback("Fail in getting slack user info");
                }
            }
        ], callback);
    }
}

module.exports = TikvaAdminBot;