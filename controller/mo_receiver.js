const RedisSMQ = require("rsmq");
const RSMQWorker = require('rsmq-worker');

class MOReceiver {

    constructor({ rsmqMO, rsmqMT }) {
        this.rsmqMT = rsmqMT;

        this.rsmq = new RedisSMQ( { client : REDIS, ns: "tikvaRSMQ" } );
        this.worker = new RSMQWorker(rsmqMO, {
            rsmq : this.rsmq
        });

        let me = this;

        this.worker.on("message", (messageString, next, id) => {
            log.info("SEEMS LIKE I RECEVEIVE 2 MESSAGES, what is this?", messageString);
            let message = JSON.parse(messageString);
            next();
            me.receiveMO(message);
        });
    }

    start(callback) {
        this.worker.start();

        if(callback) {
            callback();
        }
    }

    receiveMO(message) {} //for override

    queueMT(message) {
        console.log("QUEUE MT", message);
        this.rsmq.sendMessage({ qname : this.rsmqMT, message : JSON.stringify(message) }, () => {});
    }
}

module.exports = MOReceiver;