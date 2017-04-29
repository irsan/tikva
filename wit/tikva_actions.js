const Bunyan = require('bunyan');
const StringTemplate = require('string-template');
const UUID = require('node-uuid');
const Vasync = require('vasync');

const log = Bunyan.createLogger({name: "tikva:wit/TikvaActions"});

const Actions = require('./actions');

const Model = require('../model/model');

class TikvaActions extends Actions {

    sendMessage(message) {}

    constructMessage(text, { user, channel }, callback) {
        let attachments = null;

        if(text == "greeting") {
            text = "Hi [[user_name]]";
            attachments = [
                {
                    "text": "How can I help you?",
                    "fallback": "Sorry, I can't do that.",
                    "callback_id": "wopr_action",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "action",
                            "text": "Add FTV",
                            "type": "button",
                            "value": "add_ftv"
                        },
                        {
                            "name": "action",
                            "text": "Add Decision",
                            "type": "button",
                            "value": "add_decision"
                        }
                    ]
                }
            ]
        }

        let message = {
            user,
            text : StringTemplate(text.replace(/\[\[/g, "{").replace(/\]\]/g, "}"), {
                user_name : user.name
            }),
            channel
        };

        if(attachments) {
            message.attachments = attachments;
        }

        callback(null, message);
    }

    setIntent({context, entities}) {
        return new Promise((resolve, reject) => {
            log.info("--- WIT ACTIONS : THE SET INTENT: ", entities);

            let intent = this.getFirstEntityValue(entities, "intent");

            if(intent == "greetings") {
                context.greeting = true;
                context.done = true;
            } else {
                context.oops = true;
                context.done = true;
            }

            return resolve(context);
        });
    }
}

module.exports = TikvaActions;