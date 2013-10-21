var date = require('../../util/date'),
	config = require('../../config'),
	moment = require('moment'),
	expect = require('expect.js');

describe('Date - Days until', function () {

	it('should get days until', function () {
		var now = moment();
		var future_date = '01.01.2100';
		var future_moment = moment(future_date, config.application.date_format_short);
		var days = date.get_days_until(future_date);

		// warning: might fail if executed right on midnight: moment in get_days_until will be different to this moment
		expect(future_moment.diff(now, 'days')).to.be(days);
	});

});