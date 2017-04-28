const Bunyan = require('bunyan');
const UUID = require('node-uuid');
const Vasync = require('vasync');

const log = Bunyan.createLogger({name: "tikva:wit/TikvaActions"});

const Actions = require('./actions');

const Model = require('../model/model');

class TikvaActions extends Actions {

    sendMessage(message) {}

    setIntent({context, entities}) {
        return new Promise((resolve, reject) => {
            log.info("--- WIT ACTIONS : THE SET INTENT: ", entities);

            let intent = this.getFirstEntityValue(entities, "intent");

            return resolve(context);
        });
    }
}

module.exports = TikvaActions;