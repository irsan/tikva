const StringTemplate = require('string-template');

class Actions {

    send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;

        let { user } = context;
        console.log("SENDINGGGGGG", user);

        let message = {
            user,
            text : StringTemplate(text.replace(/\[\[/g, "{").replace(/\]\]/g, "}"), {
                user_name : user.name
            })
        }

        console.log("SENDINGGGGGG 222222222", context);


        this.sendMessage(message);
    }

    sendMessage(message) {}


    getFirstEntityValue(entities, entity) {
        const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 &&
            entities[entity][0].value;
        if (!val) {
            return null;
        }
        return typeof val === 'object' ? val.value : val;
    }
}

module.exports = Actions;