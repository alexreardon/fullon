var format = require('util').format,
	_ = require('underscore');


// environment config: https://docs.google.com/spreadsheet/ccc?key=0AqpFjrRXOZsGdENRbllvTThURFViMTB4N1VSQjJ0ckE#gid=0
// request access from Alex Reardon

var config = {

	//database
	db_connection: process.env.fullon_db_connection,


	//google
	google_username: process.env.fullon_google_username,
	google_password: process.env.fullon_google_password,
	google_spreadsheet_key: process.env.fullon_google_spreadsheet_key,

	//authentication
	job_username: process.env.fullon_job_username || 'username',
	job_password: process.env.fullon_job_password || 'password',

	//application
	leaderboard_size: 10,

	//paypal


	//web
	port: process.env.PORT || 80,
	cookie_secret: process.env.fullon_cookie_secret || 'some secret key',

	//application - dates
	date_format_short: 'DD/MM/YYYY',
	date_format_long: 'YYYY-MM-DD HH:mm:ss',

	date_camp_start: '01/01/2014'

};

//environment force - want to make ultra sure we don't play with production db
if(process.env.NODE_ENV !== 'production') {
	console.info('using development database');
	config.db_connection = 'mongodb://127.0.0.1:27017/test';
}

var errors = [];
_.each(config, function(item, i) {
	if(!item) {
		errors.push(i);
	}
});

if(errors.length) {
	console.warn(format('missing config entries for: %j', errors));
}


module.exports = config;