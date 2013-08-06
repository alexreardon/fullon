var config = require('./config'),
	MongoClient = require('mongodb').MongoClient,
	format = require('util').format;


function connect(cb) {
	MongoClient.connect(config.db_connection, function(err, db) {
		if(err){
			cb(format('error connecting to db [%s]: %j', config.db_connection, err));
			return;
		}
		cb(null, db);
	});
}

exports.connect = connect;