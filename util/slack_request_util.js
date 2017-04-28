const Bunyan = require('bunyan');
const Slack = require('slack');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : "tikva:util/RequestUtil" })

const Model = require('../model/model');

class SlackRequestUtil {

    static authenticate(req, res, next) {
        log.info("THE BODY", req.body);
        let slackid = req.body.user_id;

        Vasync.waterfall([
            (callback) => {
                //verify token
                if(req.body.token != PROPERTIES.vault.slackVerificationToken) {
                    log.error("THE TOKEN MISMATCHED", req.body.token, PROPERTIES.vault.slackVerificationToken);
                    return callback("Sorry, you can't do this.");
                }

                Slack.users.info({
                    token : PROPERTIES.vault.slackAccessToken,
                    user : slackid
                }, callback);
            },
            (slackData, callback) => {
                if(slackData.ok) {
                    let administrator = PROPERTIES.slack.administrators.indexOf(req.body.user_id) > -1;

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
                                administrator,
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
                            user.administrator;
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
        ], (error, user) => {
            if(error) {
                return res.send(error);
            }

            req.user = user;
            next();
        })

    }

    static setCarecell(req, res, next) {
        Vasync.waterfall([
            (callback) => {
                if(!req.body.channel_id) {
                    return callback("Invalid Channel ID");
                }

                Model.Carecell.findOne({
                    slackChannel : req.body.channel_id,
                    status : 'active'
                }, callback);
            }
        ], (error, carecell) => {
            if(error || !carecell) {
                log.error("SET CARECELL FAILED", error);
                return res.send("No carecell");
            }

            req.carecell = carecell;
            next();
        });
    }
}

module.exports = SlackRequestUtil;