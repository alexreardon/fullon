var express = require('express'),
	config = require('./config'),
	path = require('path'),
	app = express();

//view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//middleware - features
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());

//static file serving
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

//middleware - flow
app.use(app.router);

//TODO: routeNotFound
//app.use(routeNotFound);



//development
if('development' === app.get('env')){
	app.use(express.errorHandler());
}

//production
var errorHandler = function(err, req, res, next){
	//TODO: load error view
};

if('production' === app.get('env')){
	app.use(errorHandler);
}


//Routes
var routes = {
	home: require('./routes/home'),
	register: require('./routes/register')
};


app.get('/', routes.home.countdown);
app.get('/register', routes.register.index);

//start the server
app.listen(config.port, function(){
	console.log('Full On now listening on port ' + config.port);
});

//export app
module.exports = app;