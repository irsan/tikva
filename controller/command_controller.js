const Bunyan = require('bunyan');
const Vasync = require('vasync');

class CommandController {

    constructor() {
        this.log = Bunyan.createLogger({ name : 'tikva:controller/CommandController'});
    }

    parseCommand(command, user, callback) {
        if(command.match(/^add ftv$/i)) {
            this.log.info("ADD FTV");
            return callback(null, {
                text : "/tikva add ftv\ntest test"
            });
        }
        callback(null, "Ok, your command is " + command);
    }

    addFTV(user, callback) {
        
    }
}

module.exports = CommandController;