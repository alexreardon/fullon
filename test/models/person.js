var person = require('../../models/person'),
	base_model = require('../../models/base_model'),
	expect = require('expect.js'),
	config = require('../../config'),
	_ = require('underscore');

describe('person', function () {

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
			},
			{
				firstname: 'Bob',
				lastname: 'Smith',
				sold: 1,
				attributed: 0
			}
		],
		people;

	beforeEach(function () {
		people = [];
		_.each(data, function (item) {
			people.push(person.create({data: item}));
		});
	});

	it('Should be an instance of base_model', function () {
		var p = person.create({data: data[0]});
		expect(p.prototype).to.be(person.prototype);
		expect(p.prototype).to.be(base_model.prototype);
	});

	describe('leaderboard', function () {
		it('should have a position', function () {
			people = person._calculate_positions(people);
			var success = 0;
			_.each(people, function (prsn) {
				if (prsn.temp.position) {
					success++;
				}
			});
			expect(success).to.be(people.length);
		});

		it('should have correct positions', function () {
			people = person._calculate_positions(people);
			expect(people[0].temp).to.have.property('position', 1);
			expect(people[1].temp).to.have.property('position', 1);
			expect(people[2].temp).to.have.property('position', 2);
		});

		it('should have get a get_leaderboard function', function () {
			expect(person.get_leaderboard).to.be.a('function');
		});

		it('should have correct shared position info', function () {
			people = person._calculate_positions(people);
			expect(people[0].temp).to.have.property('shared', 1);
			expect(people[1].temp).to.have.property('shared', 1);
			expect(people[2].temp).to.have.property('shared', 0);
		});

	});

	describe('stats', function () {

		var stats,
			boxes_sold;

		beforeEach(function () {
			stats = person._calculate_stats(people);
			boxes_sold = 0;

			_.each(people, function (person) {
				boxes_sold += person.data.sold;
			});
		});

		it('should get boxes sold', function () {
			expect(stats.boxes_sold).to.be(boxes_sold);
		});

		it('should calculate money raised', function () {
			var money_raised = (boxes_sold * config.application.discounts.chocolate.amount);
			expect(stats.money_raised).to.be(money_raised);
		});

		it('should know how many campers can come for free', function () {
			var money_raised = (boxes_sold * config.application.discounts.chocolate.amount);
			var amount = (money_raised / config.application.camper_types.junior.fee).toFixed(2);
			expect(stats.campers_who_could_come_for_free).to.be(amount);
		});

		it('should know which family sold the most boxes', function () {
			expect(stats.top_family.name).to.be('Reardon');
		});

		it('should know how many boxes of chocolate the top family sold', function () {
			var reardon_boxes = 0;

			_.each(people, function (item) {
				if (item.data.lastname === 'Reardon') {
					reardon_boxes += item.data.sold;
				}
			});

			expect(stats.top_family.sold).to.be(reardon_boxes);
		});

	});

});
