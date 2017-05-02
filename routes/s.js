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

            Model.Carecell.findOne({
                _id: req.body.carecell, status: 'active'
            }, callback);
        },
        (carecell, callback) => {
            if(!carecell) {
                return callback("Invalid Carecell");
            }

            // new Model.FollowUp({
            //     name            : req.body.name,
            //     phone           : req.body.phone,
            //     address         : req.body.address,
            //     oikosOf         : req.body.oikosOf,
            //     carecell        : req.body.carecell,
            //     dob             : String,
            //     gender          : { type : String, enum : [ 'male', 'female' ] },
            //     marritalStatus  : { type : String, enum : [ 'single', 'married', 'widow', 'divorce' ] },
            //     comments        : String,
            //     serviceDate     : Date,
            //     ftv             : { type :Boolean, default : true },
            //     decision        : { type : Boolean, default : false },
            // })

            callback(null, {});
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