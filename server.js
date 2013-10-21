var app = require('./app'),
	config = require('./config');

// Start the server
app.listen(config.port, function () {
	console.log('Full On now listening on port ' + config.port);
});