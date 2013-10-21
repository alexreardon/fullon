var spreadsheet = require('../jobs/spreadsheet'),
	report = require('../jobs/report'),
	config = require('../config'),
	moment = require('moment'),
	format = require('util').format,
	express = require('express');

function auth (req, res, next) {
	express.basicAuth(config.job_username, config.job_password)(req, res, next);
}

function create_filename () {
	return format('fullon2014-registrations-%s.csv', moment().format(config.application.date_format_long));
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

	app.get('/jobs/report', auth, function (req, res, next) {
		report.run(function (err, csv) {
			if (err) {
				return next(new Error(err));
			}

			res.attachment(create_filename());
			res.end(csv, 'UTF-8');
		});
	});
};

