const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/slack' });

var router = Express.Router();

/* GET home page. */
router.get('/:key', (req, res, next) => {
    log.info(req.params);
    Vasync.waterfall([
        (callback) => {
            if(!req.params.key || req.params.key != PROPERTIES.slackKey) {
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
    res.render('index', {title: 'Tikva'});
});

module.exports = router;