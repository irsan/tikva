const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

const Model = require('../model/model');

var router = Express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {title: 'Tikva'});
});

router.get('/user', (req, res) => {
    log.info("TESTTTTTTTTT", req.session.user);
    res.send("ok");
});

module.exports = router;