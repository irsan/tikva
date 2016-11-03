const Bunyan = require('bunyan');
const Express = require('express');
const Vasync = require('vasync');
const YahyaCommon = require('yahya-common');
const YahyaModel = require('yahya-model');
const Request = require('request');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

var router = Express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
router.post('/fb_callback', (req, res, next) => {
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
