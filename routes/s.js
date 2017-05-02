const Bunyan = require('bunyan');
const Express = require('express');
const Request = require('request');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'tikva:routes/s' });

const Model = require('../model/model');

const Response = require('../util/response');

var router = Express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    log.info("S USER", req.user);
    res.render('index', {title: 'Tikva'});
});

router.get('/add_ftv', (req, res) => {
    res.render('s_add_ftv', {title: 'Tikva'});
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

router.post('/rest/ftv/add', (req, res) => {
    Vasync.waterfall([
        (callback) => {
            log.info("ADD FTV BODY", req.body);

            if(!req.body.name || req.body.name.length == 0) {
                return callback("Name is required");
            }

            if(!req.body.serviceDate) {
                return callback("Service Date is required");
            }

            if(req.body.carecell) {
                Model.Carecell.findOne({
                    _id: req.body.carecell, status: 'active'
                }, callback);
            } else {
                callback(null, null);
            }
        },
        (carecell, callback) => {
            let followUp = new Model.FollowUp({
                name            : req.body.name,
                gender          : { type : String, enum : [ 'male', 'female' ] },
                marritalStatus  : { type : String, enum : [ 'single', 'married', 'widow', 'divorce' ] },
                serviceDate     : new Date(req.body.serviceDate),
                ftv             : { type :Boolean, default : true },
                decision        : { type : Boolean, default : false },
            });

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

            followUp.save((error, ftv) => {
                if(error) {
                    return callback(error);
                }

                callback(null, { ftv });
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
    })
});

module.exports = router;