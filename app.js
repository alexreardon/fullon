var express = require('express'),
	app = express();

require('./configuration').init(express, app);


//Routes
var routes = {
	home: require('./routes/home'),
	register: require('./routes/register')
};


app.get('/', routes.home.countdown);
app.get('/register', routes.register.index);


//export app
module.exports = app;