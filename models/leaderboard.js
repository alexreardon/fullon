var config = require('../config'),
	database = require('../db'),
	_ = require('underscore'),
	Person = require('../models/Person');

exports.get = function(collection_name, cb) {

	database.connect(function(db) {
		var collection = db.collection(collection_name);

		// get all people with sold > 0 - limit to leaderboard_size
		var cursor = collection.find({sold: {$gt: 0}}).limit(config.leaderboard_size);

		cursor.toArray(function(err, doc) {
			var people = [];
			_.each(doc, function(person) {
				people.push(new Person(person));
			});
			cb(err, people);
		});
	});
};