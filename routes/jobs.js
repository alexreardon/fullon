var spreadsheet = require('../jobs/spreadsheet'),
	config = require('../config'),
	express = require('express');

exports.routes = function(app){
	app.get('/jobs/getspreadsheet', express.basicAuth(config.job_username, config.job_password), function (req, res, next) {
		spreadsheet.run(function (err) {
			if (err) {
				next(new Error(err));
				return;
			}
			res.send('success');
		});

	});
};

