const Bunyan = require('bunyan')
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Express = require('express');
const Favicon = require('serve-favicon');
const FS = require('fs');
const Logger = require('morgan');
const Mongoose = require('mongoose');
const Path = require('path');
const Session = require('express-session');
const Redis = require("redis");

const log = Bunyan.createLogger({ name : 'tikva:app' });
const mode = process.env.MODE ? process.env.MODE : "local";
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];
log.info(mode, PROPERTIES);

Mongoose.Promise = global.Promise;
Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb
const redis = Redis.createClient(PROPERTIES.redis.url);

var RedisStore = require('connect-redis')(Session);

YAHYA_FB = JSON.parse(FS.readFileSync('./resources/yahya-fb.json', 'utf8'));

var index = require('./routes/index');
var users = require('./routes/admin');

var app = Express();

var redisStore = new RedisStore({
    client: redis
});

var session = Session({
    secret: PROPERTIES.session_secret,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: redisStore,
    resave: true,
    saveUninitialized: true
});

// view engine setup
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Logger('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));
app.use(CookieParser());
app.use(Express.static(Path.join(__dirname, 'public')));
app.use(session);

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
