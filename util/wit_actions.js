const Bunyan = require('bunyan');
const Moment = require('moment');
const Vasync = require('vasync');

const log = Bunyan.createLogger({name: "tikva:util/WitActions"});

function getFirstEntityValue(entities, entity) {
    const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 &&
        entities[entity][0].value;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
}

class WitActions {

    constructor() {
    }

    send(request, response) {
        log.info("--- WIT ACTIONS : CALLING SEND");
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;

        log.info("SESSION ID: ", sessionId);
        log.info("INCOMING TEXT: ", request.text);
        log.info("OUTGOING TEXT: ", text);

        //TODO: send message
        return Promise.resolve();
    }
}

module.exports = WitActions;