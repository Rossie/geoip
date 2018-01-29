var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var template_helpers = require('./middlewares/template_helpers');

var index = require('./routes/index');
var ipView = require('./routes/ip-view');
var api = require('./routes/api');
var commentApi = require('./routes/comment-api');
var contact = require('./routes/contact');
var about = require('./routes/about');
var privacy = require('./routes/privacy');
var myreq = require('./routes/myreq');
var config = require('./config');

var app = express();
app.locals.config = config; // makes accessible in templates

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// session
var sess = {
  secret: '976a7962-67bf-4eca-9967-5cca8c53c43f',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(template_helpers); // setting up template functions/variables

app.use('/', index);
app.use('/ips', ipView);
app.use('/api', api);
app.use('/comment-api', commentApi);
app.use('/contact', contact);
app.use('/about', about);
app.use('/privacy', privacy);
app.use('/myreq', myreq);

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
