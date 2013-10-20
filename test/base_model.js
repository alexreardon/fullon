var base_model = require('../models/base_model'),
	expect = require('expect.js'),
	database = require('../util/db'),
	sinon = require('sinon'),
	_ = require('underscore');

describe.skip('Inheritence', function () {

	it('should work - classical', function () {

		function Parent (params) {
			this.firstname = params.firstname;
			this.count = 0;
		}

		//member functions
		Parent.prototype = (function () {
			function update () {
				this.count++;
			}

			return {
				update: update
			};
		})();

		//class functions
		Parent.find = function () {
			console.log('do stuff');
		};

		function Child (params) {
			Parent.call(this, params);
		}

		Child.prototype = (function () {
			function reset () {
				this.count = 0;
			}

			return {
				reset: reset
			};

		})();

		var child = new Child({firstname: 'Alex'});

		expect(child).to.be.a(Child);

	});

	it('prototype inheritence', function () {

		var parent = (function () {

			function create (data) {
				var self = Object.create(this);
				self.data = data;
				return self;
			}

			function getData () {
				return this.data;
			}

			return {
				create: create,
				getData: getData
			};
		})();

		var child = parent.create({name: 'Alex'});
		expect(child.prototype).to.be(parent.prototype);

	});

});

describe('Base Model', function () {

	var collection_name = 'test',
		search_keys = ['firstname', 'lastname'],
		data;

	function dropCollection (name, cb) {
		database.connect(function (err, db) {
			var collection = db.collection(name);
			collection.drop();
			db.close();
			cb();
		});
	}

	beforeEach(function () {
		data = [
			{firstname: 'Bob', lastname: 'Smith', age: 20},
			{firstname: 'Alex', lastname: 'Reardon', age: 25},
			{firstname: 'Ben', lastname: 'Reardon', age: 23}
		];
	});

	//cleanup after every test
	afterEach(function (done) {
		dropCollection(collection_name, done);
	});

	describe('Create and Save', function () {

		var model;

		beforeEach(function () {
			model = base_model.create({
				data: data[0],
				collection_name: collection_name,
				search_key_fields: search_keys
			});
		});

		it('Should create new objects', function () {
			expect(model).to.be.an('object');
			expect(model.prototype).to.be(base_model.prototype);
		});

		it('Should create objects with the correct properties', function () {
			expect(model).to.have.property('collection_name', collection_name);
			expect(model).to.have.property('data', data[0]);
			expect(model.temp).to.be.empty();
			expect(model).to.have.property('search_key_fields', search_keys);
		});

		it('Should create a valid search query based on search keys', function () {
			var query = model.get_search_query();

			var count = 0;
			_.each(model.search_key_fields, function (item, i) {
				if (query[item] === model.data[item]) {
					count++;
				}
			});
			expect(count).to.be(model.search_key_fields.length);
		});

		it('Should create call update without crashing', function (done) {
			//using base_model.find
			model.save(function (err) {
				expect(err).to.not.be.ok();
				done();
			});
		});

		it('Should create data in database', function (done) {
			//using base_model.find
			model.save(function (err) {
				model.find({}, function (err, result) {
					expect(result).to.have.length(1);
					expect(result[0].data.firstname).to.equal(data[0].firstname);
					done();
				});
			});
		});

		it('Should not create data in database if does not exist and upsert is false', function (done) {
			//using base_model.find
			model.save(function (err) {
				model.find({}, function (err, result) {
					expect(result).to.have.length(0);
					done();
				});
			}, false);
		});

		it('Should update data in database without creating new entry', function (done) {

			model.save(function (err) {

				var age = 10;
				model.data.age = age;
				model.save(function () {

					model.find({}, function (err, result) {
						expect(result).to.have.length(1);
						expect(result[0].data.age).to.be(age);
						done();
					});
				});
			});
		});

		describe('save multiple', function () {

			var stub;

			beforeEach(function () {
				stub = sinon.stub(base_model, 'save', function (cb) {
					cb();
				});
			});

			afterEach(function () {
				stub.restore();
			});

			it('should save multiple', function (done) {

				var data = [
					base_model.create({
						data: data,
						collection_name: collection_name,
						search_key_fields: search_keys
					})
				];

				model.save_multiple(data, function () {
					expect(base_model.save.callCount).to.be(data.length);
					done();
				});

				stub.restore();

			});

		});

	});

	describe('create with _id', function () {
		var model,
			_id = 'test123';

		beforeEach(function () {
			model = base_model.create({
				data: data[0],
				collection_name: collection_name,
				_id: _id
			});
		});

		it('should have an id field', function () {
			expect(model._id).to.be(_id);
		});

		it('should return _id in search query', function () {
			expect(model.get_search_query()._id).to.be(_id);
		});

		it('should create a model with _id when saving', function (done) {
			model.save(function (err) {
				model.find({_id: _id}, function (err, result) {
					expect(result).to.have.length(1);
					expect(result[0]._id).to.be(_id);
					done();
				});
			});
		});

		it('should update a model with _id when saving (and not make duplicate)', function (done) {
			var name = 'Alex';
			model.save(function (err) {
				model.data.name = name;
				model.save(function (err) {
					model.find({_id: _id}, function (err, result) {
						expect(result).to.have.length(1);
						expect(result[0]._id).to.be(_id);
						expect(result[0].data.name).to.be(name);
						done();
					});
				});
			});
		});
	});

	describe('Searching', function () {

		var models;

		beforeEach(function (done) {
			models = [];
			var count = 0;
			_.each(data, function (item, i) {
				var model = base_model.create({
					data: item,
					collection_name: collection_name,
					search_key_fields: search_keys
				});

				models.push(model);
				model.save(function () {
					count++;
					if (count === data.length) {
						done();
					}
				});
			});
		});

		//models are cleaned up in global afterEach

		describe.skip('Find', function () {

			it('should find no items when none exist', function () {
				dropCollection(collection_name, function () {
					models[0].find({}, function (err, result) {
						expect(result).to.have.length(0);
					});
				});

			});

			it('Should find all existing items', function (done) {
				models[0].find({}, function (err, result) {
					expect(result).to.have.length(models.length);
					done();
				});
			});

			it('Should find items based on a query', function (done) {
				models[0].find({age: {$gt: 24}}, function (err, result) {
					expect(result).to.have.length(1);
					done();
				});

			});

			it('Should limit results', function (done) {
				var limit = 1;
				models[0].find({}, function (err, result) {
					expect(result).to.have.length(limit);
					done();
				}, limit);

			});

			it('Should sort results', function (done) {
				models[0].find({}, function (err, result) {
					expect(result[0].data.firstname).to.be(data[0].firstname);
					done();
				}, null, {'age': 1});
			});
		});

		describe('Aggregate', function () {

			it('should aggregate data', function (done) {
				var group = { _id: '$lastname'};

				models[0].aggregate(group, null, function (err, result) {
					expect(result.length).to.be(2);
					done();
				});

			});

			it('should perform operations on aggregated data', function (done) {
				var group = { _id: '$lastname', sum: { $sum: '$age'}};

				models[0].aggregate(group, null, function (err, result) {
					var reardon = _.find(result, function (item) {
						return (item._id === 'Reardon');
					});
					expect(reardon.sum).to.be(data[1].age + data[2].age);
					done();
				});

			});

			it('should sort aggregated data', function (done) {
				var group = { _id: '$lastname', sum: { $sum: '$age'}};
				var sort = { sum: -1 };
				var sort2 = { sum: 1 };
				var count = 0;

				models[0].aggregate(group, sort, function (err, result) {
					expect(result[0].sum > result[1].sum).to.be(true);
					count++;
					if (count >= 2) {
						done();
					}

				});

				models[0].aggregate(group, sort2, function (err, result) {
					expect(result[0].sum < result[1].sum).to.be(true);
					count++;
					if (count >= 2) {
						done();
					}
				});

			});
		});

	});

});




