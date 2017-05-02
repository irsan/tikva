const Bunyan = require('bunyan');
const Express = require('express');
const SimpleGit = require('simple-git');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/git' });

const router = Express.Router();

router.post('/pull', (req, res) => {
    // if(req.params.token != PROPERTIES.vault.slackVerificationToken) {
    //     return res.status(404).send("Not Found");
    // }
    //
    // let simpleGit = SimpleGit('./');
    // simpleGit.pull((error, result) => {
    //     log.info("GIT PULL", error, result);
    //     if(error) {
    //         return res.status(500).send(error);
    //     }
    //
    //     res.send(result);
    // });

    log.info("req", req.headers);

    res.send('Ok');
});

module.exports = router;