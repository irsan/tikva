const Bunyan = require('bunyan');
const Express = require('express');
const Model = require('../models/model');
const Request = require('request');
const Vasync = require('vasync');

const InstallController = require('../controller/install_controller');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

var router = Express.Router();

var installController = new InstallController();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
router.post('/fb_callback', (req, res, next) => {
    if(!installController.installed) {
        installController.install(req.query.key, req.body, (error, data) => {
            if(error) {
                log.info("ERRORRRR", error);
                res.status(500);
                return res.send(error);
            }

            var options = {
                url : PROPERTIES.yahyaFB.url + "/" + YAHYA_FB.key + "/send",
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                },
                json: {
                    recipientId: data.user.fbid,
                    message: data.message,
                }
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

            return res.send("Ok");
        });
    } else {
        next();
    }
}, (req, res, next) => {
    // if(req.query.key != PROPERTIES['yahya-fb-callback'].key) {
    //     res.status(404);
    //     res.send("Invalid key");
    // }
    next();
}, (req, res) => {
    log.info("body", req.body);
    res.send("Ok");
});

module.exports = router;
