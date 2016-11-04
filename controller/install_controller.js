const _ = require('lodash');
const Bunyan = require('bunyan');
const FS = require('fs');
const Model = require('../models/model');
const RandomString = require('randomstring');
const UUID = require('node-uuid');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:controller.Installer' });

const INSTALLED_FILE = './resources/installed.json';
const INSTALLED_EXAMPLE_FILE = './resources/installed.example.json';

function Installer() {
    var installer = this;

    Vasync.waterfall([
        (callback) => {//check if installed.json exists if not copy from installed.example.json
            if(FS.existsSync(INSTALLED_FILE)) {
                return callback();
            }

            var writeStream = FS.createWriteStream(INSTALLED_FILE);

            writeStream.on('close', function() {
                callback();
            });

            FS.createReadStream(INSTALLED_EXAMPLE_FILE).pipe(writeStream);
        }
    ], () => {
        installer.installed = JSON.parse(FS.readFileSync('./resources/installed.json', 'utf8')).installed;
        if(!installer.installed) {
            installer.key = RandomString.generate(7);
        }
    });
}

Installer.prototype.install = function(key, data, callback) {
    var installer = this;

    Vasync.waterfall([
        (callback) => {//get sender Id and message
            if(data.object != "page" && data.entry.length == 0) {
                return callback("Parse body failed");
            }

            callback(null, {
                senderId : data.entry[0].messaging[0].sender.id,
                message : data.entry[0].messaging[0].message.text
            });
        },
        (data, callback) => {//get user info
            if(data.message != installer.key) {
                return callback("Invalid key");
            }

            var options = {
                url : PROPERTIES.yahyaFB.url + "/" + key + "/user/" + senderId,
                method : 'GET'
            };

            Request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var sender = JSON.parse(body);
                    sender.id = senderId;
                    callback(null, sender);
                } else {
                    callback(error);
                }
            });
        },
        (sender, callback) => {//parse sender detail and create admin user
            if(sender.status != 'Ok') {
                return callback("Get Sender's info failed");
            }

            var user = new Model.User({
                name            : sender.data['first_name'] + " " + sender.data['last_name'],
                fbid            : sender.id,
                administrator   : true,
                profileImage    : sender.data['profile_pic']
            });

            user.save((error, user) => {
                callback(error, user);
            });
        },
        (user, callback) => {//update installed.json
            FS.truncate("./resources/installed.json", 0, () => {

                FS.writeFile("./resources/installed.json", JSON.stringify({ installed : true }), (error) => {
                    if(error) {
                        log.error("Error writing file: " + error);
                        return callback(error);
                    }

                    installer.installed = true;
                    callback(null, user);
                });
            });
        },
        (user, callback) => {
            FS.truncate("./resources/yahya-fb.json", 0, () => {

                FS.writeFile("./resources/yahya-fb.json", JSON.stringify({ key : key }), (error) => {
                    if(error) {
                        log.error("Error writing file: " + error);
                        return callback(error);
                    }
                    callback(null, {
                        user : user,
                        message : "Hi " + user.name + ", you are now an Administrator."
                    });
                });
            });
        }
    ], callback);
};

module.exports = Installer;