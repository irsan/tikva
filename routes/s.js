const Bunyan = require('bunyan');
const Express = require('express');
const Moment = require('moment');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/s' });

const Model = require('../model/model');

const Pagination = require('../util/pagination');
const Response = require('../util/response');

var router = Express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    log.info("S USER", req.user);
    res.render('s_index', {title: 'Tikva'});
});

router.get('/add_ftv', (req, res) => {
    res.render('s_add_ftv', {title: 'Tikva'});
});

router.get('/followups', (req, res) => {
    res.render('s_followups', {title: 'Tikva'});
});

router.get('/rest/carecell/list', (req, res) => {
    Vasync.waterfall([
        (callback) => {
            Model.Carecell.find({ status : 'active'}, callback);
        },
        (carecells, callback) => {
            callback(null, { carecells });
        }
    ], (error, data) => {
        var response = new Response();
        if(error) {
            response.fail(error);
        } else {
            response.data = data;
        }
        res.send(response);
    });
});

router.post('/rest/followup/add', (req, res) => {
    Vasync.waterfall([
        (callback) => {
            log.info("ADD Follow Up BODY", req.body);

            if(!req.body.ftv && !req.body.decision) {
                return callback("Invalid Type of follow up")
            }

            if(!req.body.name || req.body.name.length == 0) {
                return callback("Name is required");
            }

            if(!req.body.serviceDate) {
                return callback("Service Date is required");
            }

            if(req.body.carecell && req.body.carecell != "no carecell") {
                Model.Carecell.findOne({
                    _id: req.body.carecell, status: 'active'
                }, callback);
            } else {
                callback(null, null);
            }
        },
        (carecell, callback) => {
            let followUp = new Model.FollowUp({
                name : req.body.name,
                serviceDate : new Date(req.body.serviceDate),
                creator : req.user.username,
                updater : req.user.username
            });

            if(req.body.ftv) {
                followUp.ftv = true;
            }

            if(req.body.decision) {
                followUp.decision = true;
            }

            if(req.body.phone) {
                followUp.phone = req.body.phone;
            }

            if(req.body.address) {
                followUp.address = req.body.address;
            }

            if(req.body.oikosOf) {
                followUp.oikosOf = req.body.oikosOf;
            }

            if(req.body.dob) {
                followUp.dob = new Date(req.body.dob);
            }

            if(req.body.gender) {
                followUp.gender = req.body.gender;
            }

            if(req.body.status) {
                followUp.marritalStatus = req.body.status;
            }

            if(req.body.comments) {
                followUp.comments = req.body.comments;
            }

            if(carecell) {
                followUp.carecell = carecell;
            }

            followUp.save((error, followUp) => {
                if(error) {
                    return callback(error);
                }

                log.info("SAVED FOR FOLLOWUP", followUp);

                callback(null, followUp);
            });
        },
        (followUp, callback) => {
            Model.ServiceDate.count({
                date : followUp.serviceDate,
                status : 'active'
            }, (error, count) => {
                if(error) {
                    return callback(error);
                }

                callback(null, { count, followUp });
            })
        },
        ({ count, followUp }, callback) => {
            if(count > 0) {
                Model.ServiceDate.findOneAndUpdate({
                    date : followUp.serviceDate,
                    status : 'active'
                }, {
                    $inc: { followUpCount : 1 },
                    updater : req.user.username
                }, (error) => {
                    if(error) {
                        return callback(error);
                    }

                    return callback(null, { followUp });
                });
            }

            new Model.ServiceDate({
                date : followUp.serviceDate,
                followUpCount : 1,
                creator : req.user.username,
                updater : req.user.username
            }).save((error) => {
                if(error) {
                    return callback(error);
                }

                callback(null, { followup });
            })
        }
    ], (error, data) => {
        var response = new Response();
        if(error) {
            response.fail(error);
        } else {
            response.data = data;
        }
        res.send(response);
    })
});

router.post('/rest/followups', (req, res) => {
    Vasync.waterfall([
        (callback) => {
            if(!req.body.date) {
                return callback("Invalid Date");
            }

            let moment = Moment(req.body.date);
            let serviceDate = moment.startOf('day').toDate();

            Model.FollowUp.find({
                serviceDate,
                status : 'active'
            }).populate({
                path : 'carecell',
                select : 'name -_id'
            }).sort('-serviceDate').exec(callback);
        },
        (followUps, callback) => {
            callback(null, { followUps });
        }
    ], (error, data) => {
        var response = new Response();
        if(error) {
            response.fail(error);
        } else {
            response.data = data;
        }
        res.send(response);
    });
});

module.exports = router;