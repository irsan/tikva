const Bunyan = require('bunyan');
const AWS = require('aws-sdk');
const Express = require('express');
const Multer = require('multer')
const MulterS3 = require('multer-s3');
const UUID = require('uuid');

const Response = require('../util/response');

const log = Bunyan.createLogger({ name: "tikva:upload" });

const router = Express.Router();

AWS.config.update({
    accessKeyId: 'AKIAI2LSW3KSMIB4RQFQ',
    secretAccessKey: PROPERTIES.vault['aws.s3.AKIAI2LSW3KSMIB4RQFQ'],
});
AWS.config.region = "ap-southeast-1";
const s3 = new AWS.S3();
const bucket = "jie-tikva";

var upload = Multer({
    storage: MulterS3({
        s3: s3,
        bucket: bucket,
        dirname: "public",
        acl: "public-read",
        contentType: MulterS3.AUTO_CONTENT_TYPE,
        key: function (req, file, callback) {
            callback(null, UUID.v1());
        }
    })
});

router.post('/', upload.fields([{ name: 'file', maxCount: 1 }]), function(req, res) {
    let response = new Response();
    let file = req.files.file[0];
    log.info(file);

    response.data = { file };
    res.send(response);
});

module.exports = router;