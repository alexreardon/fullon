var moment = require('moment'),
	config = require('../config');

exports.bootstrap = {
	date_format_long: config.date_format_long,
	date_format_short: config.date_format_short,
	date_now: moment().format(config.date_format_long)
};

