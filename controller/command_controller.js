const Bunyan = require('bunyan');
const Vasync = require('vasync');

class CommandController {

    constructor() {
        this.log = Bunyan.createLogger({ name : 'tikva:controller/CommandController '});
    }

    parseCommand(command, callback) {
        callback(null, "Ok, your command is " + command);
    }
}