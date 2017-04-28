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
        if(text == "greeting") {
            text = "Hi [[user_name]], how can I help you?";
        }

        let message = {
            user,
            text : StringTemplate(text.replace(/\[\[/g, "{").replace(/\]\]/g, "}"), {
                user_name : user.name
            }),
            channel
        };

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