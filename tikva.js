const Bunyan = require('bunyan')
const FS = require('fs');
const Mongoose = require('mongoose');
const Redis = require("redis");
const RedisSMQ = require("rsmq");
const Slack = require('slack');

const log = Bunyan.createLogger({ name : 'tikva:tikva' });
const mode = process.env.MODE ? process.env.MODE : "local";
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];
log.info(mode, PROPERTIES);

Mongoose.Promise = global.Promise;
Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb

REDIS = Redis.createClient(PROPERTIES.redis.url);
RSMQ = new RedisSMQ( { client : REDIS, ns: "tikvaRSMQ" } );


TOKEN = process.env.TIKVA_SLACK_KEY_TIKVA;

const AdminRoute = require('./routes/admin');

const adminRoute = new AdminRoute();

const AdminMOController = require('./controller/admin_mo_controller');

const tikva = Slack.rtm.client();

// logs: ws, started, close, listen, etc... in addition to the RTM event handler methods
// log.info(Object.keys(tikva));

// do something with the rtm.start payload
tikva.started(function(payload) {
    // log.info('payload from rtm.start', payload)
    RSMQ.createQueue({
        qname : PROPERTIES.redis.queues.adminMO
    }, (error, resp) => {
        log.info("CREATING QUEUE", error, resp);

        let adminMOController = new AdminMOController();
        adminMOController.start();
    });

    let message = {
        token : TOKEN, channel : PROPERTIES.slack.channels.admin,
        "text": "Would you like to play a game?",
        "username" : "tikva",
        "attachments": [
            {
                "text": "Choose a game to play",
                "fallback": "You are unable to choose a game",
                "callback_id": "wopr_game",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "game",
                        "text": "Chess",
                        "type": "button",
                        "value": "chess"
                    },
                    {
                        "name": "game",
                        "text": "Falken's Maze",
                        "type": "button",
                        "value": "maze"
                    },
                    {
                        "name": "game",
                        "text": "Thermonuclear War",
                        "style": "danger",
                        "type": "button",
                        "value": "war",
                        "confirm": {
                            "title": "Are you sure?",
                            "text": "Wouldn't you prefer a good game of chess?",
                            "ok_text": "Yes",
                            "dismiss_text": "No"
                        }
                    }
                ]
            }
        ]
    };

    Slack.chat.postMessage(message, (err, data) => {
        log.info("POST MESSAGE", err, data, message);
    })

});

// // respond to a user_typing message
// tikva.user_typing(function(msg) {
//     log.info('several people are coding', msg)
// });

tikva.message(function (message, test) {
    log.info('Receive Message', message, test);

    if(AdminRoute.isAdminChannel(message.channel)) {
        adminRoute.processIncoming(message)
    }
});

// start listening to the slack team associated to the token
tikva.listen({ token : TOKEN });


