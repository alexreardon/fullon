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

//start the server
app.listen(app.get('port'), function(){
	console.log('Full On now listening on port ' + app.get('port'));
});