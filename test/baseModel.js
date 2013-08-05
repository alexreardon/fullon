var baseModel = require('../models/baseModel'),
	expect = require('expect.js'),
	database = require('../db'),
	sinon = require('sinon'),
	_ = require('underscore');


describe.skip('Inheritence', function() {

	it('should work - classical', function() {

		function Parent(params) {
			this.firstname = params.firstname;
			this.count = 0;
		}

		//member functions
		Parent.prototype = (function() {
			function update() {
				this.count++;
			}

			return {
				update: update
			};
		})();

		//class functions
		Parent.find = function() {
			console.log('do stuff');
		};

		function Child(params) {
			Parent.call(this, params);
		}

		Child.prototype = (function() {
			function reset() {
				this.count = 0;
			}

			return {
				reset: reset
			};

		})();

		var child = new Child({firstname: 'Alex'});

		expect(child).to.be.a(Child);


	});

	it('prototype inheritence', function() {

		var parent = (function() {

			function create(data) {
				var self = Object.create(this);
				self.data = data;
				return self;
			}

			function getData() {
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

describe('Base Model', function() {

	var collection_name = 'test',
		searchKeys = ['firstname', 'lastname'],
		data;

	function dropCollection(name, cb) {
		database.connect(function(err, db) {
			var collection = db.collection(name);
			collection.drop();
			cb();
		});
	}

	beforeEach(function() {
		data = [
			{firstname: 'Alex', lastname: 'Reardon', age: 25},
			{firstname: 'Ben', lastname: 'Reardon', age: 23}
		];
	});

	//cleanup after every test
	afterEach(function(done) {
		dropCollection(collection_name, done);
	});

	describe('Create and Save', function() {

		var model;

		beforeEach(function() {
			model = baseModel.create(data[0], collection_name, searchKeys);
		});

		it('Should create new objects', function() {
			expect(model).to.be.an('object');
			expect(model.prototype).to.be(baseModel.prototype);
		});

		it('Should create objects with the correct properties', function() {
			expect(model).to.have.property('collection_name', collection_name);
			expect(model).to.have.property('data', data[0]);
			expect(model).to.have.property('search_key_fields', searchKeys);
		});

		it('Should create a valid search query based on search keys', function() {
			var query = model.getSearchQuery();

			var count = 0;
			_.each(model.search_key_fields, function(item, i) {
				if(query[item] === model.data[item]) {
					count++;
				}
			});
			expect(count).to.be(model.search_key_fields.length);
		});

		it('Should create call update without crashing', function(done) {
			//using baseModel.find
			model.save(function(err) {
				expect(err).to.not.be.ok();
				done();
			});
		});

		it('Should create data in database', function(done) {
			//using baseModel.find
			model.save(function(err) {
				model.find({}, function(err, result) {
					expect(result).to.have.length(1);
					expect(result[0].data.firstname).to.equal(data[0].firstname);
					done();
				});
			});
		});

		it('Should not create data in database if does not exist and upsert is false', function(done) {
			//using baseModel.find
			model.save(function(err) {
				model.find({}, function(err, result) {
					expect(result).to.have.length(0);
					done();
				});
			}, false);
		});

		it('Should update data in database without creating new entry', function(done) {

			model.save(function(err) {

				var age = 10;
				model.data.age = age;
				model.save(function() {

					model.find({}, function(err, result) {
						expect(result).to.have.length(1);
						expect(result[0].data.age).to.be(age);
						done();
					});
				});
			});
		});

		describe('save multiple', function() {

			var stub;

			beforeEach(function(){
				stub = sinon.stub(baseModel, 'save', function(cb) {
					cb();
				});
			});

			afterEach(function(){
				stub.restore();
			});

			it('should save multiple', function(done) {


				var data = [
					baseModel.create(data, collection_name, searchKeys),
					baseModel.create(data, collection_name, searchKeys)
				];

				model.saveMultiple(data, function() {
					expect(baseModel.save.callCount).to.be(data.length);
					done();
				});

				stub.restore();


			});


		});


	});

	describe('Find', function() {

		var models;

		beforeEach(function(done) {
			models = [];
			var count = 0;
			_.each(data, function(item, i) {
				var model = baseModel.create(item, collection_name, searchKeys);
				models.push(model);
				model.save(function() {
					count++;
					if(count === data.length) {
						done();
					}
				});
			});

		});

		it('should find no items when none exist', function() {
			dropCollection(collection_name, function() {
				models[0].find({}, function(err, result) {
					expect(result).to.have.length(0);
				});
			});


		});

		it('Should find all existing items', function(done) {
			models[0].find({}, function(err, result) {
				expect(result).to.have.length(models.length);
				done();
			});
		});

		it('Should find items based on a query', function(done) {
			models[0].find({age: {$gt: 24}}, function(err, result) {
				expect(result).to.have.length(1);
				done();
			});

		});

		it('Should limit results', function(done) {
			var limit = 1;
			models[0].find({}, function(err, result) {
				expect(result).to.have.length(limit);
				done();
			}, limit);

		});

		it('Should sort results', function(done){
			models[0].find({}, function(err, result) {
				expect(result[0].data.firstname).to.be(data[1].firstname);
				done();
			}, null, {'age': 1});
		});
	});

});




