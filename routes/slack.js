const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/slack' });

var router = Express.Router();

router.post('/:key', (req, res, next) => {
    log.info(req.params);
    Vasync.waterfall([
        (callback) => {//check if the key is valid
            if(!req.params.key || req.params.key != PROPERTIES.slackkey) {
                return callback("Invalid key");
            }

            callback();
        }
    ], (error) => {
        if(error) {
            res.status(500);
            return res.send(error);
        }

        next();
    })
}, (req, res) => {
    log.info("THE BODY: ", req.body);
    if(req.body.type == "url_verification") {
        res.send({
            challenge : req.body.challenge
        });
    } else {
        res.render('index', {title: 'Tikva'});
    }
});

module.exports = router;