var express = require('express'),
	config = require('./config'),
	_ = require('underscore'),
	path = require('path'),
	fs = require('fs'),
	format = require('util').format,
	hbs = require('hbs'),
	helpers = require('./views/helpers'),
	locals = require('./util/locals'),
	app = express();

//views
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

_.each(helpers, function (val, key) {
	hbs.registerHelper(key, val);
});

//middleware - features

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());

//static file serving
app.use('/public', express.static(path.join(__dirname, '/public')));

//bootstrap data
app.locals.bootstrap = JSON.stringify(locals.bootstrap);

// middleware - flow
app.use(app.router);

// error handling
var errorLogger = function (err, req, res, next) {
	console.error(err);
	next(err);
};
var errorPageNotFound = function (req, res) {
	res.status(404);
	res.render('error', { url: req.url });
};

app.use(errorLogger);
app.use(errorPageNotFound);

//TODO: routeNotFound
//app.use(routeNotFound);

//development
//if ('development' === app.get('env')) {
//	app.use(express.errorHandler());
//}

//production

//
//if ('production' === app.get('env')) {
//	//app.use(express.errorHandler());
//	//app.use(errorHandler); TODO
//}

//load in routes
_.each(fs.readdirSync('./routes'), function (file) {
	require('./routes/' + file).routes(app);
});

//start the server
app.listen(config.port, function () {
	console.log('Full On now listening on port ' + config.port);
});