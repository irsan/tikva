const Bunyan = require('bunyan');
const crypto = require('crypto');
const Express = require('express');
const SimpleGit = require('simple-git');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/git' });

const router = Express.Router();

router.post('/pull', (req, res) => {
    log.info("GIT PULL WITH BODY: ", req.headers);

    let hmac = crypto.createHmac("sha1", "yucca-orchid-avert-tight-began");
    console.log("CREATE HMAC");
    let calculatedSignature = "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");
    console.log(req.headers["x-hub-signature"] === calculatedSignature); // Returns false
    console.log(req.headers["x-hub-signature"]) // => sha1=blablabla
    console.log(calculatedSignature)
    res.send("Ok");
    // let signature = crypto.createHmac('sha1', 'yucca-orchid-avert-tight-began').update(JSON.stringify(req.body).digest('hex');
    //
    // log.info("THE  SIGNATURE IS: ", signature);
    //
    // if(req.headers['x-hub-signature'] != "sha1=db1d44b1b8660ccb0665d99c0bc1d0bba3b73d0f") {
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
});

module.exports = router;