var moment = require('moment'),
	config = require('../config');

exports.get_days_until = function(end_date){

	var now = moment(),
		end = moment(end_date, config.application.date_format_short);

	return end.diff(now, 'days');
};