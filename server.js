var app = require('./app');

//start the server
app.listen(app.get('port'), function(){
	console.log('Full On now listening on port ' + app.get('port'));
});