var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var csurf = require('csurf');
var methodOverride = require('method-override');

var user = require('./lib/middleware/user');
var common = require('./routes/common');

//  app
var app = express();
var csrfProtection = csurf({ cookie: true });

//  app config
app.set('root', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/siso_server');

//  middleware setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'siso system', store: new RedisStore }));
app.use(express.static(app.get('root')));
app.use(methodOverride('_method'));

//  routes
app.use(user);
app.use(require('./routes/routes')(app));

//  handle 404 and error
app.use(common.notfound);
app.use(common.error);

//  run app
app.set('port', 4000);
app.listen(app.get('port'), function () {
    console.log('server running at http://localhost:' + app.get('port'));

    //  auto open browser
    //var spawn = require('child_process').spawn;
    //spawn('open', ['http://localhost:4000']);
});
module.exports = app;
