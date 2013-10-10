var app = require('../app'),
	moment = require('moment'),
	person = require('../models/person'),
	config = require('../config');

var scripts = ['/public/js/pages/index.js'];

app.get('/', function (req, res, next) {

	//(query, cb, limit, sort)
	//find all people with sold > 0, limit: 10, in decending order of amount sold
	person.get_leaderboard(function (err, people) {
		if (err) {
			next(new Error(err));
			return;
		}

		res.render('index', {
			people: people,
			leaderboard_size: config.leaderboard_size,
			scripts: scripts
		});
	});
});