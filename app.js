var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').config();

// Set up routes
var index = require('./routes/index')(passport);
var passport_config = require('./config/passport')(passport);
var details = require('./routes/details');
var whyUseUs = require('./routes/why-use-us');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session
app.use(session({
	cookie: {maxAge: 3600000}, // Set cookie duration to 1hr
	secret: 'superSecretPassword', // TODO Change password for prod
	resave: false,
	saveUninitialized: true
}));

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Set up mongoose connection
var mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Successful connection to db');
});

app.use('/', index);
app.use('/why-use-us', whyUseUs);
app.use('/details', details);
app.use('/controllers', express.static(process.cwd() + '/controllers'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
