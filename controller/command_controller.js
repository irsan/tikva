const Bunyan = require('bunyan');
const Vasync = require('vasync');

class CommandController {

    constructor() {
        this.log = Bunyan.createLogger({ name : 'tikva:controller/CommandController'});
    }

    parseCommand(command, user, callback) {
        if(command.match(/^add ftv$/i)) {
            return this.addFTV(user, callback);
        }
        callback(null, "Ok, your command is " + command);
    }

    addFTV(user, callback) {
        new Model.AuthroizedLink({
            user : user, redirect : "/user"
        }).save((error, link) => {
            if(error) {
                log.error("ERROR", error);
                callback(error);
            }
            callback(null, "<http://tikva.sweethope.life/auth/authorized/" + link.id +"|Click here to start>");
        });

    }
}

module.exports = CommandController;