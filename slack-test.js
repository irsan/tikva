const Bunyan = require('bunyan');
const Slack = require('slack');

const log = Bunyan.createLogger({ name : 'tikva:slack-test' });


let bot = Slack.rtm.client();

let token = "xoxb-175685553588-eALBx5VpfeVhZFcZZorFrfuj";

// logs: ws, started, close, listen, etc... in addition to the RTM event handler methods
log.info(Object.keys(bot));

// do something with the rtm.start payload
bot.started(function(payload) {
    log.info('payload from rtm.start', payload)
});

// respond to a user_typing message
bot.user_typing(function(msg) {
    log.info('several people are coding', msg)
});

bot.message(function(msg) {
    log.info("RECEIVED MESSAGE", msg);
});



// start listening to the slack team associated to the token
bot.listen({ token });

Slack.chat.postMessage({
    token,
    "channel" : "C4YUSL56D",
    "text" : "hi",
    username : "hope",
    as_user : true,
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
                },
            ]
        }
    ]
}, (error, data) => {
    log.info("ECHO: ", error, data);
});