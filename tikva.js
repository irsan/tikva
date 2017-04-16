const Bunyan = require('bunyan')
const FS = require('fs');
const Mongoose = require('mongoose');
const Redis = require("redis");
const Slack = require('slack')
const tikva = Slack.rtm.client()

const log = Bunyan.createLogger({ name : 'tikva:app' });
const mode = process.env.MODE ? process.env.MODE : "local";
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];
log.info(mode, PROPERTIES);

Mongoose.Promise = global.Promise;
Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb
const redis = Redis.createClient(PROPERTIES.redis.url);

// logs: ws, started, close, listen, etc... in addition to the RTM event handler methods
log.info(Object.keys(tikva));

// do something with the rtm.start payload
tikva.started(function(payload) {
    log.info('payload from rtm.start', payload)
});

// respond to a user_typing message
tikva.user_typing(function(msg) {
    log.info('several people are coding', msg)
});

// start listening to the slack team associated to the token
tikva.listen({ token: PROPERTIES.slack.botToken });