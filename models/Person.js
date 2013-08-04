var database = require('../db'),
	config = require('../config'),
	_ = require('underscore');

var collection_name = 'people';

//TODO: create baseModel class

function Person(params){
	this.firstname = params.firstname;
	this.lastname = params.lastname;
	this.sold = params.sold || 0;
	this.attributed = params.attributed || 0;
	this._id = params._id;
}

//instance methods - revealing prototype pattern
Person.prototype = (function(){

	function update(cb){
		database.connect(function(db){
			var collection = db.collection(config.db_collection_people);

			collection.update(
				{firstname: this.firstname, lastname: this.lastname}, //query
				{$set: { sold: this.sold, attributed: this.attributed}}, //change values
				{upsert: true}, //options - upsert: create if none found
				function(err) {

					if(err) {
						cb(err);
					}

					cb(null, this);
				}
			);
		});
	}

	return {
		update: update
	};

})();

//class methods
Person.find = function(query, limit, cb){

	database.connect(function(db) {
		var collection = db.collection(collection_name);

		var cursor = collection.find(query);

		if(limit){
			cursor = cursor.limit(limit);
		}

		cursor.toArray(function(err, doc) {
			var people = [];
			_.each(doc, function(person) {
				people.push(new Person(person));
			});
			cb(err, people);
		});


	});

};

module.exports = Person;