//Jobs
var spreadsheet = require('../jobs/spreadsheet'),
	config = require('../config');


exports.getspreadsheet = function (req, res, next) {
	spreadsheet.run(config.db_collection_spreadsheet, function (err) {
		if (err) {
			console.error('error getting spreadsheet data');
			next(new Error(err));
			return;
		}
		res.send('success');
	});
};