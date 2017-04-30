const Bunyan = require('bunyan');
const Slack = require('slack');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : "tikva:util/RequestUtil" })

const Model = require('../model/model');

class SlackRequestUtil {

    static authenticate(req, res, next) {
        let payload = req.body.payload ? JSON.parse(req.body.payload): req.body;
        let slackid = payload.user_id ? payload.user_id : payload.user.id;

        Vasync.waterfall([
            (callback) => {
                //verify token
                if(payload.token != PROPERTIES.vault.slackVerificationToken) {
                    log.error("THE TOKEN MISMATCHED", payload.token, PROPERTIES.vault.slackVerificationToken);
                    return callback("Sorry, you can't do this.");
                }

                Slack.users.info({
                    token : PROPERTIES.vault.slackAccessToken,
                    user : slackid
                }, callback);
            },
            (slackData, callback) => {
                if(slackData.ok) {
                    let administrator = PROPERTIES.slack.administrators.indexOf(payload.user_id) > -1;

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
                log.info("WHAT's THE ERROR?", error);
                return res.send(error);
            }

            req.user = user;
            next();
        })

    }

    static setCarecell(req, res, next) {
        Vasync.waterfall([
            (callback) => {
                if(!payload.channel_id) {
                    return callback("Invalid Channel ID");
                }

                Model.Carecell.findOne({
                    slackChannel : payload.channel_id,
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

    static authenticateS(req, res, next) {
        Vasync.waterfall([
            (callback) => {
                if(!req.session.user) {
                    return callback("No user session found");
                }

                Model.User.findOne({
                    _id : req.session.user,
                    status : 'active'
                }, callback);
            }
        ], (error, user) => {
            if(error) {
                log.error("Forbidden to S pages", error);
                return res.status(403).send("Forbidden");
            }

            req.user = user;
            next();
        });
    }
}

module.exports = SlackRequestUtil;