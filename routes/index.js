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
        // var key = req.query.key;
        //
        // var options = {
        //     url : PROPERTIES.yahyaFB.url + "/" + key + "/user/" +
        // };

        log.info("THE INFO", JSON.stringify(req.body));

        return res.send("Ok");
    }
    next();
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
