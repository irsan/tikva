const Bunyan = require('bunyan');
const Crypto = require('crypto');
const Express = require('express');
const SimpleGit = require('simple-git');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/git' });

const router = Express.Router();

router.post('/pull', (req, res) => {
    log.info("GIT PULL WITH BODY: ", req.headers);

    let hmac = Crypto.createHmac("sha1", PROPERTIES.vault.gitWebhookSecret);
    let calculatedSignature = "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");

    if(req.headers["x-hub-signature"] !== calculatedSignature) {
        return res.status(404).send("Not Found");
    }

    let simpleGit = SimpleGit('./');
    simpleGit.pull((error, result) => {
        log.info("GIT PULL", error, result);
    });

    res.send("Ok");
});

module.exports = router;