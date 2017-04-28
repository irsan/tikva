const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/slack' });

const Model = require('../model/model');

var router = Express.Router();

/* GET home page. */
router.post('/button', (req, res) => {
    log.info("BUTTON PRESSED", req.body);
    res.send("Ok");
});

/* GET home page. */
router.post('/menu', (req, res) => {
    log.info("MENU SELECTED", req.body);
    res.send("Ok");
});

router.post('/cmd/make_cell', (req, res) => {
    log.info("MAKE CELL", req.body, PROPERTIES.vault);
    if(req.body.token == PROPERTIES.vault.slackTokenTikva) {
        res.send("Ok, cell");
    } else {
        res.send("Sorry, you can't do this");
    }
});

module.exports = router;