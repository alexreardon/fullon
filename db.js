var config = require('./config'),
	MongoClient = require('mongodb').MongoClient;


function connect(cb) {
	MongoClient.connect(config.db_connection, function(err, db) {
		if(err){
			console.error('error connecting to db [%s]: %j', config.db_connection, err);
			return;
		}
		cb(db);

	});
}

exports.connect = connect;