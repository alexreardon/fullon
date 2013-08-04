var config = require('../config'),
	database = require('../db');

exports.get = function(collection, cb) {



	database.connect(function(db) {
		var collection = db.collection(config.db_collection_spreadsheet);

		var cursor = collection.find({sold: {$gt: 0}}).limit(config.leaderboard_size);

		cursor.toArray(function(err, doc) {
			cb(err, doc);
		});
	});
};