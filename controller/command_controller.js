const Bunyan = require('bunyan');
const Vasync = require('vasync');

class CommandController {

    constructor() {
        this.log = Bunyan.createLogger({ name : 'tikva:controller/CommandController'});
    }

    parseCommand(command, callback) {
        if(command.match(/^add ftv$/i)) {
            this.log.info("ADD FTV");
        }
        callback(null, "Ok, your command is " + command);
    }
}

module.exports = CommandController;