const Bunyan = require('bunyan');
const Express = require('express');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

var router = Express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
router.post('/fb_callback', (req, res, next) => {
    req.installed = false;
    next();
}, (req, res) => {
    log.info("body", req.body);
    res.send("Ok");
});

module.exports = router;
