const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

var router = Express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
router.post('/fb_callback', (req, res, next) => {
    if(!req.installed) {
        var key = req.query.key;
        var data = req.body;

        Vasync.waterfall([
            (callback) => {//get sender Id
                if(data.object != "page" && data.entry.length == 0) {
                    return callback("Parse body failed");
                }

                var senderId = data.entry[0].messaging[0].sender.id;

                callback(null, senderId);
            },
            (senderId, callback) => {//get user info
                var options = {
                    url : PROPERTIES.yahyaFB.url + "/" + key + "/user/" + senderId,
                    method : 'GET'
                };

                Request(options, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        callback(null, JSON.parse(body));
                    } else {
                        callback(error);
                    }
                });
            },
            (sender, callback) => {//parse sender detail
                if(sender.status != 'Ok') {
                    callback("Get Sender's info failed");
                }

                log.info("Name", sender.data);
                callback();
            }
        ], (error, data) => {
            if(error) {
                log.info("PARSE ERROR", error);
                res.status(500);
                return res.send(error);
            }

            return res.send("Ok");
        });
    } else {
        next();
    }
}, (req, res, next) => {
    if(req.query.key != PROPERTIES['yahya-fb-callback'].key) {
        res.status(404);
        res.send("Invalid key");
    }
    next();
}, (req, res) => {
    log.info("body", req.body);
    res.send("Ok");
});

module.exports = router;
