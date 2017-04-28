const Bunyan = require('bunyan')
const FS = require('fs');
const Mongoose = require('mongoose');
const Redis = require("redis");
                                                                                                                                   const Vasync = require('vasync');
const Vault = require('node-vault');

const log = Bunyan.createLogger({ name : 'tikva:tikva' });
const mode = process.env.MODE ? process.env.MODE : "local";
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];

Mongoose.Promise = global.Promise;
Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb

REDIS = Redis.createClient(PROPERTIES.redis.url);

const TikvaBot = require('./slack/tikva_bot');
const TikvaMOReceiver = require('./controller/tikva_mo_receiver');

let vaultKeys = JSON.parse(FS.readFileSync('/var/keys/vault.json', 'utf8'));

let vault = Vault({
    apiVersion: 'v1', // default
    endpoint: 'http://vault:8200', // default
    token: vaultKeys["Initial Root Token"]
});

Vasync.waterfall([
    (callback) => {
        vault.unseal({ secret_shares: 1, key: vaultKeys["Unseal Key 1"] }).then((data) => {
            callback();
        }).catch(callback);
    },
    (callback) => {
        vault.unseal({ secret_shares: 1, key: vaultKeys["Unseal Key 2"] }).then((data) => {
            callback();
        }).catch(callback);
    },
    (callback) => {
        vault.unseal({ secret_shares: 1, key: vaultKeys["Unseal Key 3"] }).then((data) => {
            callback();
        }).catch(callback);
    },
    (callback) => {
        vault.read(mode + "/properties").then(({ data }) => {
            PROPERTIES.vault = data;
            callback();
        });
    }
], (error) => {
    if(error) {
        log.error(error);
    }

    log.info(mode, PROPERTIES);

    let tikvaBot = new TikvaBot({
        token : PROPERTIES.vault.slackTokenTikva,
        rsmqMO : PROPERTIES.redis.queues.tikvaMO,
        rsmqMT : PROPERTIES.redis.queues.tikvaMT,
        channel : PROPERTIES.slack.channels.admin
    });

    let tikvaMOReceiver = new TikvaMOReceiver({
        rsmqMO : PROPERTIES.redis.queues.tikvaMO,
        rsmqMT : PROPERTIES.redis.queues.tikvaMO
    });
    tikvaMOReceiver.start(() => {
        tikvaBot.start();
    });
});