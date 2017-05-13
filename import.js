const Bunyan = require('bunyan');
const FS = require('fs');
const Moment = require('moment');
const Mongoose = require('mongoose');
const Request = require('request');
const CSV = require('csvtojson');

const Model = require('./model/model');

const log = Bunyan.createLogger({ name : 'tikva:import' });

const mode = process.env.MODE ? process.env.MODE : "local";
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];

Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb

CSV().fromStream(Request.get('https://jie-tikva.s3.amazonaws.com/ftv2.csv')).on('json', (record) => {
    log.info("Record:", record);

    let { date, name, oikosOf, contacted, returned, comments, phone, address, dob, status } = record;

    let serviceDate = new Moment(date, "DD/MM/YYYY").toDate();
    let dobDate = new Moment(dob, "DD/MM/YYYY").toDate();

    let followUp = new Model.FollowUp({
        name, phone, address, oikosOf,
        dob             : dobDate,
        gender          : 'female',
        marritalStatus  : status,
        comments,
        serviceDate,
        profileImage    : "https://jie-tikva.s3.amazonaws.com/user.svg",
    });

    if(contacted && contacted == 'Y') {
        followUp.followedUpAt = new Date(serviceDate.getTime() + (1000*60*60*24*5));
    }

    if(returned && returned == 'Y') {
        followUp.returned = true;
    }

    followUp.save();

}).on('done', (error) => {
    log.info("DONE READING", error);
})