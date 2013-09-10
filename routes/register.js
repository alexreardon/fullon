var app = require('../app');

app.get('/register', function (req, res) {
	res.render('register', {title: 'Register'});
});

app.post('/register', function(req, res){
	//validate form
});