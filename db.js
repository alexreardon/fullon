var config = require('./config'),
	MongoClient = require('mongodb').MongoClient,
	format = require('util').format;


function connect(cb) {
	MongoClient.connect(config.db_connection, function(err, db) {
		if(err){
			//console.error('error connecting to db [%s]: %j', config.db_connection, err);
			throw new Error(format('error connecting to db [%s]: %j', config.db_connection, err));
		}
		cb(db);

	});
}

exports.connect = connect;