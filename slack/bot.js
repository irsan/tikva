const RedisSMQ = require("rsmq");
const RSMQWorker = require('rsmq-worker');
const Slack = require('slack');
const Vasync = require('vasync');

class Bot {
    constructor({ token, rsmqMO, rsmqMT, channel, botId }) {
        this.token = token;
        this.rsmqMO = rsmqMO;
        this.rsmqMT = rsmqMT;
        this.channel = channel;
        this.botId = botId;
        this.slack = Slack.rtm.client();
        this.rsmq = new RedisSMQ( { client : REDIS, ns: "tikvaRSMQ" } );

        let bot = this;
        let rsmq = this.rsmq;

        this.rsmq.createQueue({ qname : this.rsmqMO }, function (err, resp) {
            if (resp===1) {
                console.log("queue created")
            }
        });

        this.worker = new RSMQWorker(this.rsmqMT, {
            rsmq : this.rsmq, defaultDelay : 0.2
        });

        this.worker.on("message", (messageString, next, id) => {
            let message = JSON.parse(messageString);
            next();
            bot.processOutgoing(message);
        });

        this.slack.message((message) => {
            console.log("THE MESSAGE: ", message);

            Vasync.waterfall([
                (callback) => {
                    if(message.subtype == "me_message") {
                        return callback("Own message");
                    }

                    if(message.subtype == "bot_message") {
                        return callback("Ignore Bot Message");
                    }

                    if(message.bot_id) {
                        return callback("It is bot");
                    }

                    if(message.text.match(new RegExp("<@" + this.botId + ">")) === null && message.channel != channel) {
                        return callback();
                    }

                    bot.processIncoming(message, callback);
                }
            ], (error) => {
                if(error && message.subtype != "me_message" && message.subtype != "bot_message" && !message.bot_id) {//be sure the message has to be other's message
                    log.error("Slack On Message Error:", error);
                    // return bot.sendTextToChannel("Oops, " + error, message.channel);
                }
            });
        });
    }

    start() {
        this.worker.start();
        this.slack.listen({ token : this.token });
    }

    processIncoming(message, callback) {}

    processOutgoing(message) {
        this.sendMesage(message);
    }

    queueMO({ user, message }, callback) {
        let messageString = JSON.stringify({
            user,
            message : {
                text : message.text,
                channel : message.channel,
            },
            timestamp : new Date(parseFloat(message.ts) * 10000)
        });

        this.rsmq.sendMessage({ qname : this.rsmqMO, message : messageString }, callback);
    }

    sendMesage(message) {
        message.token = this.token;
        message.username = this.username;
        message['as_user'] = true;

        Slack.chat.postMessage(message, (err, data) => {
            console.log("POST MESSAGE TO CHANNEL", err, data);
        });
    }

    sendText(text) {
        let token = this.token;
        let channel = this.channel;
        let username = this.username;

        Slack.chat.postMessage({
            token, channel, username, as_user: true,
            text : text,
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
        }, (err, data) => {
            console.log("POST MESSAGE", err, data, text);
        });
    }
}

module.exports = Bot;