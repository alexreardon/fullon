var _ = require('underscore'),
	date = require('../util/date'),
	person = require('../models/person'),
	config = require('../config');

var scripts = ['/public/js/pages/index.js'];

exports.routes = function(app){
	app.get('/', function (req, res, next) {

		//(query, cb, limit, sort)
		//find all people with sold > 0, limit: 10, in decending order of amount sold
		person.get_leaderboard(function (err, leaderboard) {
			if (err) {
				next(new Error(err));
				return;
			}

			res.render('index', {
				people: leaderboard.people,
				stats: leaderboard.stats,
				config: config.application,
				data: date.get_page_data(),
				scripts: scripts
			});
		});
	});
};
