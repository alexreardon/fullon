var database = require('../db'),
	config = require('../config'),
	leaderboard = require('../models/leaderboard'),
	expect = require('expect.js');

describe('leaderboard', function() {


	var firstname = 'Bob',
		lastname = 'Smith',
		people = [
			{
				firstname: firstname,
				lastname: lastname,
				sold: 1,
				attributed: 0
			},
			{
				firstname: 'Jane',
				lastname: 'Smith',
				sold: 0,
				attributed: 1
			}
		];



	beforeEach(function(done) {
		//clear db
		database.connect(function(db){
			var collection = db.collection(config.db_collection_test);
			collection.drop();

			collection.insert(people, {}, function(err, objects){
				if(err){
					throw err;
				}
				if(people.length !== objects.length){
					throw new Error('inserting test data failed');
				}
				db.close();
				done();
			});
		});

	});


	it('should return people with items sold', function() {

	});

	it('should be limited', function() {

	});

	it('should return an array of matches', function(done) {
		leaderboard.get(config.db_collection_test, function(err, doc){
			expect(doc).to.have.length(1);
		});
	});


});