if(process.env.NODETIME_ACCOUNT_KEY) {
	require('nodetime').profile({
		accountKey: process.env.NODETIME_ACCOUNT_KEY,
		appName: 'FullOn 2014'
	});
}

var app = require('./app'),
	config = require('./config');

// Start the server
app.listen(config.port, function () {
	console.log('Full On now listening on port ' + config.port);
});