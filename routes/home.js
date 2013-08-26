var app = require('../app');

app.get('/', function(req, res){
	res.render('index');
});

app.get('/countdown', function(req, res){
	res.render('countdown');
});