var app = require('../app'),
	form = require('../forms/register.json');

//all routes that are not caught go to the client side router
app.get('*', function(req, res){
	res.render('layout');
});
