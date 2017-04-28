const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const SimpleGit = require('simple-git');
const Slack = require('slack');
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
    log.info("MAKE CELL", req.body);
    Vasync.waterfall([
        (callback) => {
            callback();
        //     Model.Carecell.findOne({
        //         slackChannel : req.body.channel_id,
        //         status : 'active'
        //     }, callback);
        // },
        // (carecell, callback) => {
        //     Slack.groups.info({
        //         token : PROPERTIES.vault.slackAccessToken,
        //         channel : req.body.channel_id
        //     }, (error, slackData) => {
        //         if(error) {
        //             return callback(error.toJSON());
        //         }
        //
        //         if(!slackData.ok) {
        //             return callback("Slack is not ok.");
        //         }
        //
        //         if(carecell) {
        //             carecell.name = channel
        //         }
        //     });
        }
    ], (error, message) => {
        // log.info("MAKE CELL Result", error, message);
        res.send("Ok, cell");
    });
});

router.post('/cmd/git_pull', (req, res) => {
    let simpleGit = SimpleGit('./');
    simpleGit.pull((error, result) => {
        log.info("GIT PULL", error, result);
    });
    res.send("Ok, git pulled");
});


module.exports = router;