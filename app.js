const Bunyan = require('bunyan')
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Express = require('express');
const Favicon = require('serve-favicon');
const FS = require('fs');
const Logger = require('morgan');
const Mongoose = require('mongoose');
const Path = require('path');
const Redis = require("redis");
const Session = require('express-session');
const Vasync = require('vasync');
const Vault = require('node-vault');

const log = Bunyan.createLogger({ name : 'tikva:app' });
const mode = process.env.MODE ? process.env.MODE : "local";
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];

Mongoose.Promise = global.Promise;
Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb
const redis = Redis.createClient(PROPERTIES.redis.url);

let RedisStore = require('connect-redis')(Session);

let vaultKeys = JSON.parse(FS.readFileSync('/var/keys/vault.json', 'utf8'));

log.info(vaultKeys);

// let vaultOptions = {
//     apiVersion: 'v1', // default
//     endpoint: 'http://vault:8200', // default
//     token: process.env.TOKEN // optional client token; can be fetched after valid initialization of the server
// };
//
// // get new instance of the client
// var vault = Vault(vaultOptions);
//
// let index = require('./routes/index');
// let slack = require('./routes/slack');
//
let app = Express();
//
// let redisStore = new RedisStore({
//     client: redis
// });
//
// Vasync.waterfall([
//     (callback) => {//read slack tikva token from vault
//         vault.read(mode + "/properties").then(({ data }) => {
//             PROPERTIES.vault = data;
//             callback();
//         });
//     }
// ], (error) => {
//     if(error) {
//         log.error(error);
//     }
//
//     log.info(mode, PROPERTIES);
//
//     let session = Session({
//         secret: PROPERTIES.vault.secretSession,
//         cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
//         store: redisStore,
//         resave: true,
//         saveUninitialized: true
//     });
//
//     // view engine setup
//     app.set('views', Path.join(__dirname, 'views'));
//     app.set('view engine', 'jade');
//
//     // uncomment after placing your favicon in /public
//     //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//     app.use(Logger('dev'));
//     app.use(BodyParser.json());
//     app.use(BodyParser.urlencoded({extended: false}));
//     app.use(CookieParser());
//     app.use(Express.static(Path.join(__dirname, 'public')));
//     app.use(session);
//
//     app.use('/slack', slack);
//     app.use('/', index);
//
//     // catch 404 and forward to error handler
//     app.use(function (req, res, next) {
//         let err = new Error('Not Found');
//         err.status = 404;
//         next(err);
//     });
//
//     // error handler
//     app.use(function (err, req, res, next) {
//         // set locals, only providing error in development
//         res.locals.message = err.message;
//         res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//         // render the error page
//         res.status(err.status || 500);
//         res.render('error');
//     });
// });

module.exports = app;
