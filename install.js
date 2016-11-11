const Base32 = require('thirty-two');
const Crypto = require('crypto');
const FS = require('fs');
const Model = require('./model/model');
const Mongoose = require('mongoose');
const NOTP = require('notp');
const Prompt = require('prompt');
const RandomString = require('randomstring');
const Vasync = require('vasync');

const PROPERTIES_FILE = "./resources/properties.json";

Vasync.waterfall([
    (callback) => {
        var schema = {
            properties : {
                newProperties : {
                    description : 'Do you want to setup new properties? (y/n)',
                    message : 'Please answer with \'y\' or \'n\'',
                    pattern : /^[ynYN]+$/,
                    required : true
                }
            }
        };

        Prompt.start();
        Prompt.get(schema, callback);
    },
    (answer, callback) => {
        if(answer.newProperties == 'y') {
            Vasync.waterfall([
                (callback) => {//delete properties.json
                    FS.unlink(PROPERTIES_FILE, () => {
                        callback();
                    })
                },
                (callback) => {//prompt user to input mongo redis and witKey
                    Prompt.start();
                    Prompt.get(['mongo', 'redis', 'witKey'], callback);
                },
                (promptResult, callback) => {//
                    console.log("PROMPT RESULT:", promptResult);

                    var properties = {
                        adminKey : key,
                        mongodb : promptResult.mongo,
                        redis : {
                            url : promptResult.redis
                        },
                        wit : {
                            key : promptResult.witKey
                        },
                        fb : {
                            graphAPI : "https://graph.facebook.com/v2.6"
                        },
                        "session_secret" : RandomString.generate(16)
                    };

                    FS.writeFile(PROPERTIES_FILE, JSON.stringify(properties), callback);
                }
            ], callback)
        } else {
            callback();
        }
    },
    (callback) => {
        var properties = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'));
        Mongoose.connect(properties.mongodb);
        Mongoose.Promise = global.Promise;

        var schema = {
            properties : {
                gavriFBKey : {
                    description : 'Key for Gavri FB'
                }
            }
        };

        Prompt.start();
        Prompt.get(schema, callback);
    },
    (answer, callback) => {//create admin webhook
        Model.Webhook({
            name : 'Admin',
            verifyToken : RandomString.generate(16)
        }).save((error, webhook) => {
            if(error) {
                return callback(error);
            }

            var shasum = Crypto.createHash('sha256');
            shasum.update(webhook._id.toString() + webhook.name + webhook.verifyToken + new Date().getTime());
            webhook.key = shasum.digest('hex');
            webhook.save();
            callback(null, {
                webhook : webhook,
                pageAccessToken : answer.pageAccessToken
            });
        });
    },
    (data, callback) => {//create admin page
        Model.Page({
            name            : "Gavri FB Admin Page",
            pageAccessToken : data.pageAccessToken,
            adminPage       : true,
            webhook         : data.webhook
        }).save((error) => {
            if(error) {
                return callback(error);
            }
            callback();
        });
    }
], (error) => {
    if(error) {
        console.log("ERROR", error);
    } else {
        console.log("Installation done");
    }
    Mongoose.connection.close();
});