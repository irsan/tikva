const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const SimpleGit = require('simple-git');
const Slack = require('slack');
const UUID = require('uuid/v1');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/slack' });

const Model = require('../model/model');

const SlackRequestUtil = require('../util/slack_request_util');

const CommandController = require('../controller/command_controller');

const router = Express.Router();

let commandController = new CommandController();

/* GET home page. */
router.post('/button', (req, res) => {
    log.info("BUTTON PRESSED", req.body);
    res.send("<http://www.google.com|Please click to start>");
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
            Model.Carecell.findOne({
                slackChannel : req.body.channel_id,
                status : 'active'
            }, callback);
        },
        (carecell, callback) => {
            if(carecell) {
                return callback("This group is already a carecell called " + carecell.name + ".");
            }

            new Model.Carecell({
                name            : req.body.text,
                key             : "cc-" + UUID(),
                slackChannel    : req.body.channel_id,
                creator         : req.user.slackname,
                updater         : req.user.slackname,
            }).save((error, carecell) => {
                if(error) {
                    return callback(error);
                }

                return callback(null, carecell);
            })
        }
    ], (error, carecell) => {
        if(error) {
            return res.send(error);
        }

        res.send("Ok, this group is now " + carecell.name + " Carecell.");
    });
});

router.post('/cmd', (req, res) => {
    log.info("COMMAND IS HERE", req.body);
    Vasync.waterfall([
        (callback) => {
            if(!req.body.text) {
                return callback("Invalid command");
            }
            commandController.parseCommand(req.body, req.user, callback);
        }
    ], (error, reply) => {
        if(error) {
            log.error("Command Error", error);
            return res.send("Oops, you cannot do that");
        }

        res.send(reply);
    });
})

router.post('/cmd/add/:followUp', SlackRequestUtil.setCarecell, (req, res) => {
    res.send("Ok, Let's add " + req.params.followUp);
});

router.post('/cmd/git_pull', (req, res) => {
    let simpleGit = SimpleGit('./');
    simpleGit.pull((error, result) => {
        log.info("GIT PULL", error, result);
    });
    res.send("Ok, git pulled");
});

module.exports = router;