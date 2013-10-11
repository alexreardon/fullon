var format = require('util').format,
	_ = require('underscore');

// environment config: https://docs.google.com/spreadsheet/ccc?key=0AqpFjrRXOZsGdENRbllvTThURFViMTB4N1VSQjJ0ckE#gid=0
// request access from Alex Reardon

// used in multiple places
var date_earlybird_end = '17.11.2013';

var config = {

	/*** SERVER ***/
	// database
	db_connection: process.env.fullon_db_connection,

	// web
	port: process.env.PORT || 80,
	cookie_secret: process.env.fullon_cookie_secret || 'some secret key',

	// google
	google_username: process.env.fullon_google_username,
	google_password: process.env.fullon_google_password,
	google_spreadsheet_key: process.env.fullon_google_spreadsheet_key,

	// authentication
	job_username: process.env.fullon_job_username || 'username',
	job_password: process.env.fullon_job_password || 'password',

	// public variables
	application: {

		leaderboard_size: 10,

		// dates
		date_format_short: 'DD.MM.YYYY',
		date_format_long: 'YYYY-MM-DD HH:mm:ss',

		date_camp_start: '01.01.2014',
		date_register_end: '15.12.2013',
		date_earlybird_end: date_earlybird_end,

		// camper types
		camper_types: {
			junior: {
				fee: 330,
				years: [6, 7, 8],
				description: 'Years 6-8',
				flag_url: '/public/images/flags/junior.png',
				flag_no_pole_url: '/public/images/flags/junior-no-pole.png'
			},
			senior: {
				fee: 350,
				years: [9, 10, 11, 12],
				description: 'Years 9-12',
				flag_url: '/public/images/flags/senior.png',
				flag_no_pole_url: '/public/images/flags/senior-no-pole.png'
			},
			leader: {
				fee: 300,
				description: 'The Masters',
				flag_url: '/public/images/flags/leader.png',
				flag_no_pole_url: '/public/images/flags/leader-no-pole.png'
			}
		},

//		fee_junior: 330,
//		fee_senior: 350,
//		fee_leader: 300,
//
//		years_junior: [6, 7, 8],
//		years_senior: [9, 10, 11, 12],

		// discounts
		discounts: {
			chocolate: {
				name: 'Selling chocolate',
				available_to: ['junior', 'senior', 'leader'],
				amount: 20,
				description: 'Per box'
			},
			earlybird: {
				name: 'Early bird',
				available_to: ['junior', 'senior', 'leader'],
				amount: 20,
				description: format('Register before %s', date_earlybird_end),
				question: format('Are you registering before %s', date_earlybird_end)
			},
			sibling: {
				name: 'Sibling',
				available_to: ['junior', 'senior'],
				amount: 25,
				description: 'Available if you have a sibling also going to Full On',
				question: 'Do you have any siblings going on Full On?'
			},
			married: {
				name: 'Married',
				available_to: ['leader'],
				amount: 10,
				description: 'Available if you are a married leader and your spouse is going to full on',
				question: 'Are you married and is your spouse also going to full on?'
			}
		}

	}
};

//environment force - want to make ultra sure we don't play with production db
if (process.env.NODE_ENV !== 'production') {
	console.info('using development database');
	config.db_connection = 'mongodb://127.0.0.1:27017/test';
}

var errors = [];
_.each(config, function (item, i) {
	if (!item) {
		errors.push(i);
	}
});

if (errors.length) {
	console.warn(format('missing config entries for: %j', errors));
}

module.exports = config;