const AWS = require('aws-sdk');
const Request = require('request');
const S3UploadStream = require('s3-upload-stream');
const toArray = require('stream-to-array');

var s3;
var bucket;
var s3Stream;

// Constructor
function S3Util() {
};

S3Util.initS3 = function(config) {
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
    });

    AWS.config.region = config.region;

    s3 = new AWS.S3();

    bucket = config.bucket;
    s3Stream = S3UploadStream(s3);
};

S3Util.getS3 = function() { return s3; }
S3Util.getBucket = function() { return bucket; }

S3Util.list = function() {
    s3.listBuckets(function(err, data) {
        if (err) { console.log("Error:", err); }
        else {
            for (var index in data.Buckets) {
                var bucket = data.Buckets[index];
                console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
            }
        }
    });
};

S3Util.writeText = function(fileName, text, cb) {
    var myBucket = new AWS.S3({ params: { Bucket: bucket } });
    var params = { Key: fileName, Body: text };
    myBucket.upload(params, cb);
};

S3Util.get = function(fileName, callback) {
    var params = {
        Bucket: bucket, Key: fileName
    };

    var stream = s3.getObject(params).createReadStream();

    toArray(stream, callback);
};

// data: imageData = { ACL : "public-read", ContentEncoding: 'base64', ContentType: params.imageContentType }
S3Util.uploadFromURL = (url, data, callback) => {
    let request = Request.defaults({ encoding: null });
    request.get(url, function (err, res, body) {
        if(err) {
            return callback(err);
        }

        data.Body = body;

        var myBucket = new AWS.S3({ params: { Bucket: bucket } });
        myBucket.upload(data, callback);
    });
};

S3Util.upload = function(data, callback) {
    var myBucket = new AWS.S3({ params: { Bucket: bucket } });
    myBucket.upload(data, callback);
};

S3Util.getStream = function(fileName) {
    var params = {
        Bucket: bucket, Key: fileName
    };

    return s3.getObject(params).createReadStream();
};

S3Util.writeStream = function(fileName, stream, callback) {
    var params = {
        Bucket: bucket, Key: fileName
    };

    var upload = s3Stream.upload(params);
    upload.maxPartSize(20971520); // 20 MB
    upload.concurrentParts(5);

    upload.on('error', function (error) {
        callback(error);
    });

    upload.on('uploaded', function (details) {
        callback(null,details);
    });

    stream.pipe(upload);
};

S3Util.getURL = function(key, cb) {
    var params = { Bucket: bucket, Key: key };
    s3.getSignedUrl('getObject', params, cb);
};

S3Util.delete = function (fileName, callback) {
    s3.deleteObjects({
        Bucket: bucket,
        Delete: {
            Objects: [
                { Key: fileName },
            ]
        }
    }, callback);
};

// export the class
module.exports = S3Util;