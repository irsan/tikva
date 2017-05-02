const Bunyan = require('bunyan');
const crypto = require('crypto');
const Express = require('express');
const SimpleGit = require('simple-git');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/git' });

const router = Express.Router();

router.post('/pull', (req, res) => {
    log.info("GIT PULL WITH BODY: ", req.headers, req.body);

    let signature = crypto.createHmac('sha1', 'yucca-orchid-avert-tight-began').update(req.body.payload).digest('hex');

    log.info("THE SIGNATURE IS: ", signature);

    if(req.headers['x-hub-signature'] != "sha1=db1d44b1b8660ccb0665d99c0bc1d0bba3b73d0f") {
        return res.status(404).send("Not Found");
    }

    let simpleGit = SimpleGit('./');
    simpleGit.pull((error, result) => {
        log.info("GIT PULL", error, result);
        if(error) {
            return res.status(500).send(error);
        }

        res.send(result);
    });
});

module.exports = router;