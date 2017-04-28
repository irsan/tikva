const Bunyan = require('bunyan');
const Crypto = require('crypto');
const RandomString = require('randomstring');
const Vasync = require('vasync');
const Wit = require('node-wit').Wit;

const log = Bunyan.createLogger({ name : 'tikva:controller/TikvaMOReceiver' });

const Model = require('../model/model');

const TikvaActions = require('../wit/tikva_actions');

const MOReceiver = require('./mo_receiver');

const witSession = {
    getCreate({ user, channel }, callback) {
        let id = Crypto.createHash('sha256').update(user._id).digest('hex');
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
            },
            (session, callback) => {
                session.context.channel = channel;
            }
        ], callback);
    },
    get(user, callback) {
        let id = Crypto.createHash('sha256').update(user._id).digest('hex');
        REDIS.get('witSession-' + id, callback);
    },
    update(witSession, callback) {
        REDIS.set('witSession-' + witSession.id, JSON.stringify(witSession), callback);
    },
    deleteSession(witSession, callback) {
        REDIS.del('witSession-' + witSession.id, callback);
    },
    delete(user, callback) {
        let id = Crypto.createHash('sha256').update(user._id).digest('hex');
        REDIS.del('witSession-' + id, callback);
    }
};

class TikvaMOReceiver extends MOReceiver {

    constructor(params) {
        super(params);
        this.witaiToken = params.witaiToken;

        let moReceiver = this;

        let actions = new TikvaActions();
        //need to override the sendMessage function
        actions.sendMessage = (message) => {
            moReceiver.queueMT(message);
        };

        this.wit = new Wit({ accessToken: this.witaiToken, actions });
    }

    receiveMO({ user, message, timestamp }) {
        let moReceiver = this;

        Vasync.waterfall([
            (callback) => {
                witSession.getCreate({ user, channel }, callback);
            },
            (session, callback) => {
                moReceiver.wit.runActions(
                    session.witSessionId,
                    message.text,
                    session.context
                ).then((context) => {
                    callback(null, { session, context });
                });
            },
            ({ session, context }, callback) => {
                if(context.done) {
                    witSession.deleteSession(session, callback);
                } else {
                    callback(null, "Ok");
                }
            }
        ], (error, response) => {
            if(error) {
                return log.error("PROCCESSING MO ERROR", error);
            }

            log.info(response);
        });
    }
}

module.exports = TikvaMOReceiver;