const Bunyan = require('bunyan');
const Crypto = require('crypto');
const RandomString = require('randomstring');
const RSMQWorker = require('rsmq-worker');
const Slack = require('slack');
const Vasync = require('vasync');
const Wit = require('node-wit').Wit;

const log = Bunyan.createLogger({ name : 'tikva:controller/AdminMOController' });

const Model = require('../model/model');

const WitActions = require('../util/wit_actions');

const witSession = {
    getCreate(user, callback) {
        let id = Crypto.createHash('sha256').update(user.id).digest('hex');
        Vasync.waterfall([
            (callback) => { // get from redis
                REDIS.get('witSession-' + id, callback);
            },
            (storedSession, callback) => {
                if(storedSession) {
                    return callback(null, JSON.parse(storedSession));
                }

                let now = new Date();
                let session = {
                    id, witSessionId : "witSession-" + id + RandomString.generate(16) + now.getTime(),
                    context: { user, data : {} }
                };

                REDIS.set('witSession-' + id, JSON.stringify(session));
                callback(null, session);
            }
        ], callback);
    },
    get(user, callback) {
        let id = Crypto.createHash('sha256').update(user.id).digest('hex');
        REDIS.get('witSession-' + id, callback);
    },
    update(witSession, callback) {
        REDIS.set('witSession-' + witSession.id, JSON.stringify(witSession), callback);
    },
    deleteSession(witSession, callback) {
        REDIS.del('witSession-' + witSession.id, callback);
    },
    delete(user, callback) {
        let id = Crypto.createHash('sha256').update(user.id).digest('hex');
        REDIS.del('witSession-' + id, callback);
    }
};

let witActions = new WitActions();
let wit = new Wit({ accessToken: process.env.TIKVA_WITAI_TOKEN, actions : witActions });

class AdminMOController {

    constructor() {
    }

    start() {
        this.worker = new RSMQWorker(PROPERTIES.redis.queues.adminMO, {
            rsmq : RSMQ
        });
        this.worker.on("message", this.onMessage);
        this.worker.start();
    }

    onMessage(message, next) {
        let msg = JSON.parse(message);
        log.info("RECEIVED MO", msg);

        Vasync.waterfall([
            (callback) => {//get user
                Model.User.findOne({
                    slackid : msg.user,
                }, callback);
            },
            (user, callback) => {
                if(!user) {
                    return callback("Invalid administrator");
                }

                witSession.getCreate(user, callback);
            },
            (session, callback) => {
                wit.runActions(
                    session.witSessionId,
                    msg.text,
                    session.context
                ).then((context) => {
                    log.info("POST RUNNING ACTION", context);
                    callback();
                });
            }
        ], (error) => {
            next();
        });
    }
}

module.exports = AdminMOController;