const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

var router = Express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Tikva'});
});

module.exports = router;