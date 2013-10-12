var app = require('../app'),
	config = require('../config'),
	person = require('../models/person'),
	date = require('../util/date'),
	schema = require('../forms/register/schema');

var scripts = ['/public/js/build/register.build.js'];

function get_req (req, res, next) {
	person.find({}, function (err, people) {
		if (err) {
			next(new Error(err));
			return;
		}

		res.render('register', {
			title: 'Register',
			config: config.application,
			scripts: scripts,
			data: date.get_page_data(),
			people: people,
			schema: require('../forms/register/schema') //need to refresh early bird values
		});

	}, null, {firstname: 1, lastname: 1});

}

app.get('/register', get_req);

// allow segments to be passed through
app.get('/register/:section', get_req);

app.post('/register', function (req, res) {
	//validate form
});