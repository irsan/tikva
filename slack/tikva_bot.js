const Bunyan = require('bunyan');
const Slack = require('slack');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/TikvaBot' });

const Model = require('../model/model');

const Bot = require('./bot');

class TikvaBot extends Bot {

    processIncoming(message, callback) {
        let tikva = this;

        Vasync.waterfall([
            (callback) => {
                tikva.updateUser(message.user, callback);
            },
            (user, callback) => {
                tikva.queueMO({ user, message }, callback);
            }
        ], (error, resp) => {
            log.info("QUEUE TIKVA MO", error, resp);
        })
    }

    updateUser(slackid, callback) {
        let token = this.token;

        Vasync.waterfall([
            (callback) => {
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

module.exports = TikvaBot;