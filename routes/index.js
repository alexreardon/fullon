var app = require('../app'),
	moment = require('moment'),
	config = require('../config');


var scripts = ['/public/js/pages/index.js'];

app.get('/', function(req, res) {

//	var bootstrap = {
//		date_format_short: config.date_format_short,
//		date_format_long: config.date_format_long,
//		now: moment().format(config.date_format_long)
//	};
	console.log('bootstrap', app.locals.bootstrap);

	res.render('index', {
		//bootstrap: JSON.stringify(bootstrap),
		scripts: scripts
	});
});