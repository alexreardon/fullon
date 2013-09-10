var app = require('../app');

app.get('/', function (req, res, next) {
	res.render('index');
});