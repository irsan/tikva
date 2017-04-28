const Bunyan = require('bunyan');
const Crypto = require('crypto');
const RandomString = require('randomstring');
const Vasync = require('vasync');
const Wit = require('node-wit').Wit;

const log = Bunyan.createLogger({ name : 'tikva:controller/TikvaMOReceiver' });

const Model = require('../model/model');

const AdminActions = require('../wit/admin_actions');

const MOReceiver = require('./mo_receiver');



class TikvaMOReceiver extends MOReceiver {

    receiveMO({ user, message, timestamp }) {
        log.info("I AM RECEIVING MO", user, message);
    }
}

module.exports = TikvaMOReceiver;