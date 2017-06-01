const Bunyan = require('bunyan');
const Express = require('express');
const Moment = require('moment');
// const Request = require('request');
const UUID = require('uuid');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/s' });

const Model = require('../model/model');

const Pagination = require('../util/pagination');
const Response = require('../util/response');

var router = Express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    log.info("S USER", req.user);
    res.render('s_index', {
        title: 'Tikva',
        me: JSON.stringify(req.user)
    });
});

router.get('/followups', (req, res) => {
    res.render('s_followups', {title: 'Tikva'});
});

router.get('/rest/carecell/list', (req, res) => {
    let { user } = req;

    let condition = { status : 'active'};

    Vasync.waterfall([
        (callback) => {
            if(!user.administrator) {
                condition.carecell = user.carecell;
            }

            Model.Carecell.find(condition).sort('name').exec(callback);
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

router.post('/rest/sp/list', (req, res) => {
    let { user } = req;

    let { carecells } = req.body;

    let condition = { status : 'active'};

    Vasync.waterfall([
        (callback) => {
            if(!user.administrator) {
                condition.carecell = user.carecell;
            } else if(carecells) {
                condition.carecell = { $in : carecells };
            }

            log.info("THE SP CONDITION:", condition);

            Model.User.find(condition).sort('name').exec(callback);
        },
        (sps, callback) => {
            callback(null, { sps });
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
                uuid : UUID.v1(),
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

            followUp.profileImage = req.body.profileImage ? req.body.profileImage : "https://jie-tikva.s3.amazonaws.com/user.svg";

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
            } else {
                new Model.ServiceDate({
                    date : followUp.serviceDate,
                    followUpCount : 1,
                    creator : req.user.username,
                    updater : req.user.username
                }).save((error) => {
                    if(error) {
                        return callback(error);
                    }

                    callback(null, { followUp });
                })
            }
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

router.post('/rest/followups/:page', (req, res) => {
    let { page } = req.params;
    let { user } = req;

    let { search, ftv, decision, noCarecells, allCarecells, carecells } = req.body;

    log.info("THE BODDDDYYYY", req.body);

    let condition = {
        status : 'active'
    };

    Vasync.waterfall([
        (callback) => {
            if (isNaN(page) || page < 1) {
                return callback("Invalid page");
            }

            let carecellOr = {};

            if(!user.administrator) {
                carecellOr = [
                    { carecell : { $exists : false } },
                    { carecell : null },
                    { carecell : user.carecell }
                ];
            } else if(req.body != {}) {//if there is filter
                let or = [];

                if(noCarecells) {
                    or.push({ carecell : { $exists : false } });
                    or.push({ carecell : null });
                }

                if(allCarecells) {
                    or.push({ carecell : { $exists : true } });
                } else if(carecells) {
                    or.push({ carecell : { $in : carecells }});
                }

                if(or.length == 1) {
                    condition.carecell = or[0].carecell;
                } else {
                    carecellOr = or;
                }
            }

            let followUpType = [];

            if(typeof ftv == 'boolean') {
                followUpType.push()
                condition.ftv = ftv;
            }

            if(typeof decision == 'boolean') {
                condition.decision = decision;
            }

            if(carecellOr.length > 0 && followUpType.length > 0) {
                condition['$and'] = [
                    carecellOr, followUpType
                ];
            } else if(carecellOr.length > 0) {
                condition['$or'] = carecellOr;
            } else if(followUpType.length > 0) {
                condition['$or'] = followUpType;
            }

            log.info("THE CONDITION", condition);
            Model.FollowUp.count(condition, callback);
        },
        (count, callback) => {
            if(count == 0) {
                return callback(null, {
                    count : 0,
                    currentPage : 0,
                    lastPage : 0,
                    followUps : {}
                });
            }

            let pagination = new Pagination(page, 50);
            pagination.setCount(count);

            let { limit, offset, lastPage } = pagination;

            Model.FollowUp.find(condition).populate({
                path : 'carecell',
                select : 'name -_id'
            }).select('-_id').sort('-serviceDate carecell.name name').limit(limit).skip(offset).exec((error, fus) => {
                if(error) {
                    return callback(error);
                }

                let followUps = {};

                fus.forEach((fu) => {
                    let moment = Moment(fu.serviceDate);
                    let key = moment.format('YYYYMMDD');
                    if(!followUps[key]) {
                        followUps[key] = {
                            serviceDate : moment.toDate(),
                            followUps : []
                        };
                    }

                    followUps[key].followUps.push(fu);
                });

                callback(null, { count, currentPage : Number(page), lastPage, followUps });
            });
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

router.get('/rest/followup/:uuid', (req, res) => {
    let { uuid } = req.params;
    let { user } = req;

    let condition = {
        uuid,
        status : 'active'
    };

    Vasync.waterfall([
        (callback) => {
            if(!user.administrator) {
                condition['$or'] = [
                    { carecell : user.carecell }
                ];
            }

            Model.FollowUp.findOne(condition, callback);
        },
        (followUp, callback) => {
            if(!followUp) {
                return callback("Invalid Follow Up");
            }

            Model.FollowUpNote.find({
                followUp,
                status : 'active'
            }).populate({
                path : 'sp',
                select : '-_id'
            }).sort('createdAt').exec((error, followUpNotes) => {
                if(error) {
                    return callback(error);
                }

                callback(null, { followUp, followUpNotes });
            });
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

router.post('/rest/followup/:uuid/assign', (req, res) => {
    let { uuid } = req.params;
    let { user } = req;

    let condition = {
        uuid,
        status : 'active'
    };

    Vasync.waterfall([
        (callback) => {
            if(!req.body.carecell) {
                return callback("Invalid carecell");
            }

            if(!user.administrator) {
                condition['$or'] = [
                    { carecell : user.carecell }
                ];
            }

            Model.FollowUp.findOne(condition, callback);
        },
        (followUp, callback) => {
            if(!followUp) {
                return callback("Invalid Follow Up");
            }

            Model.Carecell.findOne({
                _id : req.body.carecell,
                status : 'active'
            }, (error, carecell) => {
                if(error) {
                    return callback(error);
                }

                if(!carecell) {
                    return callback("Invalid carecell");
                }

                if(!req.body.sp) {
                    return callback(null, { followUp, carecell });
                }

                Model.User.findOne({
                    _id : req.body.sp,
                    carecell,
                    status : 'active'
                }, (error, sp) => {
                    if(error) {
                        return callback(error);
                    }

                    if(!sp) {
                        return callback("Invalid SP");
                    }

                    callback(null, {
                        followUp, carecell, sp
                    });
                });
            });
        },
        ({ followUp, carecell, sp }, callback) => {
            followUp.sp = sp;
            followUp.carecell = carecell;
            followUp.updatedAt = new Date();
            followUp.updater = user.username;

            followUp.save();
            callback(null, { followUp });
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

router.post('/rest/followup/:uuid/add_note', (req, res) => {
    let { uuid } = req.params;
    let { note } = req.body;
    let { user } = req;

    let condition = {
        uuid,
        status : 'active'
    };

    Vasync.waterfall([
        (callback) => {
            if(!note) {
                return callback("Invalid note");
            }

            if(!user.administrator) {
                condition['$or'] = [
                    { carecell : user.carecell }
                ];
            }

            Model.FollowUp.findOne(condition, callback);
        },
        (followUp, callback) => {
            if(!followUp) {
                return callback("Invalid Follow Up");
            }

            new Model.FollowUpNote({
                entry : note,
                followUp,
                sp : user,
                creator : user.username,
                updater : user.username
            }).save((error, followUpNote) => {
                if(error) {
                    return callback(error);
                }

                callback(null, { followUpNote });
            });
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