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
                    Prompt.get(['mongo', 'redis', 'witKey', 'gavriFBKey'], callback);
                },
                (answer, callback) => {//
                    console.log("PROMPT RESULT:", answer);

                    var key = RandomString.generate(32);
                    var encoded = Base32.encode(32);
                    var encodedForGoogle = encoded.toString().replace(/=/g,'');
                    var uri = 'otpauth://totp/tikva?secret=' + encodedForGoogle;

                    console.log("Please use the URL below for Google Authenticator");

                    var properties = {
                        adminKey : key,
                        mongodb : answer.mongo,
                        redis : {
                            url : answer.redis
                        },
                        wit : {
                            key : answer.witKey
                        },
                        gavri : {
                            fb : {
                                key : answer.gavriFBKey
                            }
                        },
                        "session_secret" : RandomString.generate(16)
                    };

                    FS.writeFile(PROPERTIES_FILE, JSON.stringify(properties), callback);
                }
            ], callback)
        } else {
            callback();
        }
    }
], (error) => {
    if(error) {
        console.log("ERROR", error);
    } else {
        console.log("Installation done");
    }
    Mongoose.connection.close();
});