var moment = require('moment'),
	config = require('../config');

exports.get_days_until = function (end_date) {

	var now = moment(),
		end = moment(end_date, config.application.date_format_short);

	return end.diff(now, 'days');
};

exports.get_page_data = function () {
	var data = {
		days_to_camp: exports.get_days_until(config.application.date_camp_start),
		days_to_earlybird_end: exports.get_days_until(config.application.date_earlybird_end),
		days_to_registration_close: exports.get_days_until(config.application.date_register_end)
	};

	data.is_camp_open = (data.days_to_camp >= 0);
	data.is_earlybird_open = (data.days_to_earlybird_end >= 0);
	data.is_registration_open = (data.days_to_registration_close >= 0);

	return data;
};