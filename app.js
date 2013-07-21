var express = require('express'),
	app = express();

require('./configuration').init(express, app);


//Routes
var routes = {
	home: require('./routes/home')
};


app.get('/', routes.home.countdown);

//start the server
app.listen(app.get('port'), function(){
	console.log('Full On now listening on port ' + app.get('port'));
});