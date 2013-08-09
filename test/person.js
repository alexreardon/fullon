var person = require('../models/person'),
	baseModel = require('../models/baseModel'),
	expect = require('expect.js'),
	_ = require('underscore');


describe('person', function() {

	var data = [
			{
				firstname: 'Alex',
				lastname: 'Reardon',
				sold: 5,
				attributed: 0
			},
			{
				firstname: 'Ben',
				lastname: 'Reardon',
				sold: 5,
				attributed: 0
			},
			{
				firstname: 'Sam',
				lastname: 'Reardon',
				sold: 4,
				attributed: 0
			}
		],
		people;

	beforeEach(function() {
		people = [];
		_.each(data, function(item){
			people.push(person.create(item));
		});
	});


	it('Should be an instance of baseModel', function() {
		var p = person.create(data[0]);
		expect(p.prototype).to.be(person.prototype);
		expect(p.prototype).to.be(baseModel.prototype);
	});

	describe('leaderboard', function(){
		it('should have a position', function() {
			people = person._calculatePositions(people);
			var success = 0;
			_.each(people, function(prsn){
				if(prsn.temp.position){
					success++;
				}
			});
			expect(success).to.be(people.length);
		});

		it('should have correct positions', function(){
			people = person._calculatePositions(people);
			expect(people[0].temp).to.have.property('position', 1);
			expect(people[1].temp).to.have.property('position', 1);
			expect(people[2].temp).to.have.property('position', 2);
		});

		it('should have get a get_leaderboard function', function(){
			expect(person.get_leaderboard).to.be.a('function');
		});

		it.skip('should call _calculatePositions on get_leaderboard call', function(){

		});
	});


});
