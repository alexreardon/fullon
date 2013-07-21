var path = require('path');

exports.init = function(express, app){
//All Environments

//global variables
	app.set('cookie_secret', 'fknbteblptfurgmmpzcuhvqiqdnvxpvssptkzjyrjiyklxyiepkrpevwfedoucwvmbuokktqgjocuvdxfwxfyyrezcfntjqmkydbuarfntxzlspdeaynggumaumvgmkq');


//views
	app.set('port', process.env.PORT || 4000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

//middleware - features
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser(app.get('cookie_secret')));
	app.use(express.session());

//static file serving
	app.use(express.static(path.join(__dirname, 'public')));

//middleware - flow
	app.use(app.router);
	app.use(require('less-middleware')({ src: __dirname + '/public' }));


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

}