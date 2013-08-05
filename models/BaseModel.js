var database = require('../db'),
	format = require('util').format,
	_ = require('underscore');

var baseModel = Object.create(Object.prototype);

baseModel.create = function(data, collection_name, search_key_fields) {
	//'data' will be saved in the database
	var self = Object.create(this);
	self.data = data;
	self.collection_name = collection_name;
	self.search_key_fields = search_key_fields;
	return self;
};

baseModel.getSearchQuery = function(){
	var query = Object.create(null);
	_.each(this.search_key_fields, function(item, i){
		query[item] = this.data[item];
	}, this);
	return query;
};

baseModel.save = function(cb, upsert) {
	//upsert = create entry if none exists

	database.connect(function(db) {
		var collection = db.collection(this.collection_name);

		collection.update(this.getSearchQuery(), {$set: this.data}, {upsert: (upsert === false ? false : true)}, function(err) {
			if(err) {
				console.err(format('update failed: %j', err));
				return; //don't call callback
			}

			cb();

		});
	}.bind(this));
};

baseModel.find = function(query, cb, limit) {

	database.connect(function(db) {
		var collection = db.collection(this.collection_name);

		var cursor = collection.find(query);

		if(limit) {
			cursor = cursor.limit(limit);
		}

		cursor.toArray(function(err, doc) {
			if(err){
				console.error(format('error finding collection: %j', err));
				return;
			}

			var result = [];
			_.each(doc, function(item) {
				result.push(this.create(item, this.collection_name));
			}, this);
			cb(result);
		}.bind(this));


	}.bind(this));

};

baseModel.findAll = function(cb) {
	return this.find({}, null, cb);
};


module.exports = baseModel;