const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/index' });

const Model = require('../model/model');

var router = Express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    new Model.AuthroizedLink({
        url : "test1", redirect : "test1"
    }).save();
    res.render('index', {title: 'Tikva'});
});

module.exports = router;