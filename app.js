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

// Middleware - Express
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());

// Static file serving
app.use('/public', express.static(path.join(__dirname, '/public')));

// Middleware - flow
app.use(app.router);

// Error logging
app.use(function (err, req, res, next) {
	console.error(err);
	next(err);
});

// Route not found (404)
app.use(function (req, res) {
	res.status(404);
	res.render('404', { url: req.url });
});

// Server errors (500)
app.use(function (err, req, res, next) {
	res.status(500);
	res.render('500', { error: err, env: app.get('env') });
});

// Bootstrap data
app.locals.bootstrap = JSON.stringify(locals.bootstrap);

// Load in routes
_.each(fs.readdirSync('./routes'), function (file) {
	require('./routes/' + file).routes(app);
});

module.exports = app;