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

// Views
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Register helpers
_.each(helpers, function (val, key) {
	hbs.registerHelper(key, val);
});

// Middleware - features
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());

// static file serving
app.use('/public', express.static(path.join(__dirname, '/public')));

// middleware - flow
app.use(app.router);

// Error handling
var errorLogger = function (err, req, res, next) {
	console.error(err);
	next(err);
};
var error404 = function (req, res) {
	res.status(404);
	res.render('404', { url: req.url });
};
var error500 = function (err, req, res, next) {
	res.status(500);
	res.render('500', { error: err, env: app.get('env') });
};

app.use(errorLogger);
app.use(error404);
app.use(error500);

// Bootstrap data
app.locals.bootstrap = JSON.stringify(locals.bootstrap);

// Load in routes
_.each(fs.readdirSync('./routes'), function (file) {
	require('./routes/' + file).routes(app);
});

// Start the server
app.listen(config.port, function () {
	console.log('Full On now listening on port ' + config.port);
});