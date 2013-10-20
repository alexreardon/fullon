var database = require('../util/db'),
	format = require('util').format,
	_ = require('underscore');

var base_model = Object.create(Object.prototype);

// {data: {}, collection_name: string, search_key_fields: array, _id: string}
base_model.create = function (options) {

	var self = Object.create(this);
	self.data = options.data;
	self.collection_name = options.collection_name;

	// optional fields
	self.search_key_fields = options.search_key_fields;
	self._id = options._id;

	// temporary object data - won't be saved
	self.temp = Object.create(null);

	return self;
};

//base_model.create = function (data, collection_name, search_key_fields, _id) {
//	//'data' will be saved in the database
//	var self = Object.create(this);
//	self.data = data;
//	self.collection_name = collection_name;
//
//	// optional fields
//	self.search_key_fields = search_key_fields;
//	self._id = _id;
//
//	//put any temporary data here - will not be saved
//	self.temp = Object.create(null);
//
//	return self;
//};

base_model.get_search_query = function () {
	var query = Object.create(null);
	_.each(this.search_key_fields, function (item, i) {
		query[item] = this.data[item];
	}, this);

	// allow model to set it's own id
	if (this._id) {
		query._id = this._id;
	}

	return query;
};

base_model.save = function (cb, upsert) {
	//upsert = create entry if none exists

	database.connect(function (err, db) {
		if (err) {
			cb(err);
			return;
		}
		var collection = db.collection(this.collection_name);

		collection.update(this.get_search_query(), {$set: this.data}, {upsert: (upsert === false ? false : true)}, function (err) {
			db.close();

			if (err) {
				console.err(format('update failed: %j', err));
				return cb(err);
			}
			cb(null);

		});
	}.bind(this));
};

base_model.find = function (query, cb, limit, sort, doc_only) {

	database.connect(function (err, db) {
		if (err) {
			cb(err);
			return;
		}
		var collection = db.collection(this.collection_name);

		var cursor = collection.find(query);

		if (limit) {
			cursor = cursor.limit(limit);
		}

		if (sort) {
			cursor = cursor.sort(sort);
		}

		cursor.toArray(function (err, doc) {
			db.close();

			if (err) {
				cb(format('error finding collection: %j', err));
				return;
			}

			if (doc_only) {
				cb(null, doc);
				return;
			}

			var result = [];
			_.each(doc, function (item) {
				var id = item._id || null;
				delete item._id;

				result.push(this.create({
					data: item,
					collection_name: this.collection_name,
					search_key_fields: this.search_key_fields,
					_id: id
				}));
				//result.push(this.create(item, this.collection_name, this.search_key_fields, id));
			}, this);

			cb(null, result);

		}.bind(this));

	}.bind(this));

};

base_model.aggregate = function (group, sort, cb) {

	database.connect(function (err, db) {
		if (err) {
			cb(err);
			return;
		}
		var collection = db.collection(this.collection_name);

		var query = [];

		if (group) {
			query.push({ $group: group });
		}

		if (sort) {
			query.push({ $sort: sort });
		}

		collection.aggregate(query,
			function (err, result) {
				// console.log(format('query: %j result: %j', query, result));
				db.close();

				if (err) {
					cb(err);
					return;
				}

				cb(err, result);
			}

		)
		;
	}.bind(this)
	)
	;
}
;

base_model.save_multiple = function (elements, cb) {
	var failures = [],
		successCount = 0,
		failureCount = 0;

	_.each(elements, function (item) {
		item.save(function (err) {
			if (err) {
				failureCount++;
				if (!_.contains(failures, err)) {
					failures.push(err);
				}
			} else {
				successCount++;
			}

			if ((successCount + failureCount) === elements.length) {
				if (failureCount > 0) {
					cb(format('there were %d failures while saving.\nErrors: %j', failureCount, failures));
				} else {
					cb();
				}
			}
		});
	});
};

module.exports = base_model;