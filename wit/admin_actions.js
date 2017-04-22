const Bunyan = require('bunyan');
const UUID = require('node-uuid');
const Vasync = require('vasync');

const log = Bunyan.createLogger({name: "tikva:wit/AdminActions"});

const Actions = require('./actions');

const Model = require('../model/model');

class AdminActions extends Actions {

    sendMessage(message) {}

    setIntent({context, entities}) {
        return new Promise((resolve, reject) => {
            log.info("--- WIT ACTIONS : THE SET INTENT: ", entities);

            delete context.greeting;
            delete context.addUser;
            delete context.addCarecell;
            delete context.listCarecells;
            delete context.oops;
            delete context.done;

            let intent = this.getFirstEntityValue(entities, "intent");
            if(intent == "greeting") {
                context.greeting = true;
                context.done = true;
            } else if(intent == "add_user") {
                context.addUser = true;
            } else if(intent == "add_carecell") {
                context.addCarecell = true;
            } else if(intent == "list_carecells") {
                context.listCarecells = true;
            } else {
                context.oops = true;
                context.done = true;
            }

            return resolve(context);
        });
    }

    addUserSetEmail({context, entities}) {
        log.info("--- WIT ACTIONS : ADD USER SET EMAIL");

        let email = this.getFirstEntityValue(entities, "email");
        if(email) {
            context.addUserDone = email + " is added successfully.";
            context.done = true;
            return context;
        } else {
            context.addUserNoEmail = true;
            return context;
        }
    }

    addCarecellSetName({context, entities}) {
        log.info("--- WIT ACTIONS : ADD CARECELL SET NAME: ", entities);
        let name = this.getFirstEntityValue(entities, "carecell_name");

        Vasync.waterfall([
            (callback) => {
                Model.Carecell.findOne({
                    name, status : "active"
                }, callback);
            },
            (carecell, callback) => {
                if(carecell) {
                    context.addCarecellFailedExist = "The carecell name '" + name + "' is already in used.  Please try again.";
                    return callback(null, carecell);
                }

                new Model.Carecell({
                    name, key : UUID()
                }).save((error, carecell) => {
                    if(error) {
                        return callback(error);
                    }
                    context.addCarecellDone = "Carecell '" + name + "' is added successfully.";
                    context.done = true;
                    callback(null, carecell);
                });
            }
        ], (error, carecell) => {
            if(error) {
                context.addCarecellFailed = "Oops.  Something wrong. " + error;
                context.done = true;
            }
            return context;
        })
    }

    listCarecells({context, entities}) {
        return new Promise((resolve, reject) => {
            log.info("--- WIT ACTIONS : LIST CARECELLS");

            delete context.listCarecells;

            Vasync.waterfall([
                (callback) => {
                    Model.Carecell.find({status: "active"}, callback);
                },
                (carecells, callback) => {
                    let listCarecells = "";
                    if (!carecells || carecells.length == 0) {
                        listCarecells = "There is not any carecells yet. Please add carecell first.";
                    } else {
                        listCarecells = "Here are the active carecells:";
                        carecells.forEach((carecell, index) => {
                            listCarecells += " " + carecell.name;
                            if (index < (carecells.length - 1)) {
                                listCarecells += ",";
                            }
                        });
                    }
                    context.listCarecells = listCarecells;
                    context.done = true;
                    callback();
                }
            ], (error) => {
                log.info(context);
                if (!error) {
                    return resolve(context);
                }
            })
        });
    }
}

module.exports = AdminActions;