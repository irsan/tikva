const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/slack' });

var router = Express.Router();

/* GET home page. */
router.get('/:key', (req, res, next) => {
    log.info(req.params);
    next();
}, (req, res) => {
    res.render('index', {title: 'Tikva'});
});

module.exports = router;