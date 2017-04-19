const Bunyan = require('bunyan');
const Moment = require('moment');
const Slack = require('slack');
const StringTemplate = require('string-template');
const UUID = require('uuid/v1');
const Vasync = require('vasync');

const log = Bunyan.createLogger({name: "tikva:util/WitActions"});

const Model = require('../model/model');

function getFirstEntityValue(entities, entity) {
    const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 &&
        entities[entity][0].value;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
}

class WitActions {

    constructor() {}

    send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;

        log.info("--- WIT ACTIONS : CALLING SEND");
        // log.info("SESSION ID: ", sessionId);
        // log.info("INCOMING TEXT: ", request.text);

        let { user, channel } = context;
        let message = StringTemplate(text.replace(/\[\[/g, "{").replace(/\]\]/g, "}"), {
            user_name : user.name
        });

        Slack.chat.meMessage({
            token : TOKEN, channel, text : message
        }, (err, data) => {
            log.info("POST MESSAGE", err, data, message);
        })

        //TODO: send message
    }

    setIntent({context, entities}) {
        log.info("--- WIT ACTIONS : THE SET INTENT: ", entities);
        let intent = getFirstEntityValue(entities, "intent");
        if(intent == "greeting") {
            context.greeting = true;
            context.done = true;
        } else if(intent == "add_user") {
            context.addUser = true;
        } else if(intent == "add_carecell") {
            context.addCarecell = true;
        } else {
            context.oops = true;
            context.done = true;
        }
        return context;
    }

    addUserSetEmail({context, entities}) {
        log.info("--- WIT ACTIONS : ADD USER SET EMAIL");

        let email = getFirstEntityValue(entities, "email");
        if(email) {
            context.addUserDone = email + " is added successfully.";
            context.done = true;
            return context;
        } else {
            context.addUserNoEmail = true;
            return context;
        }
    }

    addCarecellSetName({context, entities}) {
        log.info("--- WIT ACTIONS : ADD CARECELL SET NAME: ", entities);
        let name = getFirstEntityValue(entities, "carecell_name");

        Vasync.waterfall([
            (callback) => {
                Model.Carecell.findOne({
                    name, status : active
                }, callback);
            },
            (carecell, callback) => {
                if(carecell) {
                    context.addCarecellFailedExist = "The carecell name '" + name + "' is already in used.  Please try again.";
                    return callback(null, carecell);
                }

                new Model.Carecell({
                    name, key : UUID()
                }).save((error, carecell) => {
                    if(error) {
                        return callback(error);
                    }
                    context.addCarecellDone = "Carecell '" + name + "' is added successfully.";
                    context.done = true;
                    callback(null, carecell);
                });
            }
        ], (error, carecell) => {
            if(error) {
                context.addCarecellFailed = "Oops.  Something wrong. " + error;
            }
            return context;
        })
    }
}

module.exports = WitActions;