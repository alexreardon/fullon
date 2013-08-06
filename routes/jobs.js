//Jobs
var spreadsheet = require('../jobs/spreadsheet'),
	config = require('../config');


exports.getspreadsheet = function (req, res, next) {
	spreadsheet.run(function (err) {
		if (err) {
			throw new Error(err);
		}
		res.send('success');
	});
};