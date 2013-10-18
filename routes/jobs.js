var spreadsheet = require('../jobs/spreadsheet'),
	report = require('../jobs/report'),
	config = require('../config'),
	express = require('express');

function auth(req, res, next){
	express.basicAuth(config.job_username, config.job_password)(req, res, next);
}

exports.routes = function (app) {
	app.get('/jobs/getspreadsheet', auth, function (req, res, next) {
		spreadsheet.run(function (err) {
			if (err) {
				return next(new Error(err));
			}
			res.send('success');
		});
	});

	app.get('/jobs/report', function (req, res, next) {
		report.run(function (err, csv) {
			if (err) {
				return next(new Error(err));
			}

			res.attachment('report.csv');
			res.end(csv, 'UTF-8');
		});
	});
};

