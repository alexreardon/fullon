var format = require('util').format,
	_ = require('underscore');


var config = {

	//database
	db_connection: process.env.fullon_db_connection || 'mongodb://127.0.0.1:27017/test',

	//google
	google_username: process.env.fullon_google_username,
	google_password: process.env.fullon_google_password,
	google_spreadsheet_key: process.env.fullon_google_spreadsheet_key,

	//paypal


	//web
	port: process.env.PORT || 80,
	cookie_secret: process.env.fullon_cookie_secret || 'some secret key'

};

var errors = [];
_.each(config, function(item, i) {
	if(!item) {
		errors.push(i);
	}
});

if(errors.length) {
	//crash application
	throw new Error(format('missing config entries for: %j', errors));
}


module.exports = config;