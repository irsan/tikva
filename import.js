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

    let { date, name, oikosOf, contacted, returned, comments, phone, address, dob, status } = record;

    log.info("THE DATE:", date);
    if(date && date.trim().length == 8) {
        let serviceDate = new Moment(date, "MM/DD/YY").toDate();
        let dobDate = (date && date.trim().length == 10) ? new Moment(dob, "MM/DD/YY").toDate() : null;
        status = status ? status.toLowerCase() : null;
        let marritalStatus = status == "single" || status == "married" ? status : null;

        let followUp = new Model.FollowUp({
            name, phone, address, oikosOf,
            dob             : dobDate,
            gender          : 'female',
            comments,
            serviceDate,
            profileImage    : "https://jie-tikva.s3.amazonaws.com/user.svg",
        });

        if(marritalStatus) {
            followUp.marritalStatus = marritalStatus;
        }

        if(contacted && contacted == 'Y') {
            followUp.followedUpAt = new Date(serviceDate.getTime() + (1000*60*60*24*5));
        }

        if(returned && returned == 'Y') {
            followUp.returned = true;
        }

        followUp.save((error, followUp) => {
            log.info("SAVED", error, followUp);
        });
    }
}).on('done', (error) => {
    log.info("DONE READING", error);
})