var express = require('express'),
	config = require('./config'),
	_ = require('underscore'),
	path = require('path'),
	fs = require('fs'),
	format = require('util').format,
	hbs = require('hbs'),
	app = express();

//view engine
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


//middleware - features
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());

//static file serving
//app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use('/public', express.static(path.join(__dirname, '/public')));

//middleware - flow
app.use(app.router);

//TODO: routeNotFound
//app.use(routeNotFound);


//development
if('development' === app.get('env')) {
	app.use(express.errorHandler());
}

//production
var errorHandler = function(err, req, res, next) {
	//TODO: load error view
};

if('production' === app.get('env')) {
	app.use(express.errorHandler());
	//app.use(errorHandler); TODO
}

//export app for routes - must be here
module.exports = app;

//load in routes
_.each(fs.readdirSync('./routes'), function(file){
	require('./routes/' + file);
});


//start the server
app.listen(config.port, function() {
	console.log('Full On now listening on port ' + config.port);
});