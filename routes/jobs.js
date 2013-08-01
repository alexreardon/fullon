//Jobs
var chocolate = require('../jobs/chocolate');


exports.getspreadsheet = function (req, res, next) {
	chocolate.run(function (err) {
		if (err) {
			console.error('error getting spreadsheet data');
			next(new Error(err));
			return;
		}
		res.send('success');
	});
};

