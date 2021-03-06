const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const SimpleGit = require('simple-git');
const Slack = require('slack');
const UUID = require('uuid/v1');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/auth' });

const Model = require('../model/model');

const router = Express.Router();

router.get('/', (req, res) => {
    res.send("ok");
});

router.get('/authorized/:authorizedId', (req, res) => {
    Model.AuthroizedLink.findOne({
        _id : req.params.authorizedId,
        status : 'active'
    }, (error, authorizedLink) => {
        if(error || !authorizedLink) {
            if(!authorizedLink) {
                error = "Not found";
            }
            log.error("Autorization S error", error);
            let status = error == "Not found" ? 404 : 500;
            return res.status(status).send(error);
        }

        req.session.user = authorizedLink.user;
        res.redirect(authorizedLink.redirect);
    });
});

module.exports = router;