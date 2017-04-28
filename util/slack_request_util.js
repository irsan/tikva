const Bunyan = require('bunyan');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : "tikva:util/RequestUtil" })

class SlackRequestUtil {

    static authenticate(req, res, next) {
        if(req.body.token == PROPERTIES.vault.slackTokenTikva) {
            return next();
        }

        return res.send("Sorry, you cannot do this");
    }
}

module.exports = SlackRequestUtil;