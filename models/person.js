var base_model = require('./base_model'),
	config = require('../config'),
	_ = require('underscore');

var person = Object.create(base_model);
person.collection_name = 'people';
person.searchKeys = ['firstname', 'lastname'];

person.create = function (data) {

	data.sold = data.sold || 0;
	data.attributed = data.attributed || 0;

	return base_model.create.call(this, data, person.collection_name, person.searchKeys);
};

person._calculate_positions = function (people) {
	//precondition - data is sorted {sold: -1, firstname: 1}

	var position = 0,
		lastSold = null;

	_.each(people, function (prsn) {
		if (prsn.data.sold !== lastSold) {
			lastSold = prsn.data.sold;
			position++;
		}
		prsn.temp.position = position;
	});

	// Get info about whether the position is shared
	for (var i = 0; i < people.length; i++) {
		people[i].temp.shared = 0;

		for (var x = 0; x < people.length; x++) {
			if (i !== x && people[i].temp.position === people[x].temp.position) {
				people[i].temp.shared++;
			}
		}

	}

	return people;

};

//person.get_leaderboard_stats = function (cb) {
//	this.aggregate({ _id: '$lastname', sold: { $sum: '$sold'}}, function (err, doc) {
//		if (err) {
//			cb(err);
//			return;
//		}
//		return this._calculate_stats(doc);
//	}.bind(this));
//
//};

person._calculate_stats = function (people) {
	// required stats:
	// 1.  boxes sold
	// 1.1 money raised (boxes sold * money per box)
	// 1.2 campers who could come for free (money raised / cost of camper)
	// 2.  top family (get first position grouped on family)

	// 1. boxes sold
	var result = {
		boxes_sold: 0,
		money_raised: null,
		campers_who_could_come_for_free: 0,
		top_family: {
			name: null,
			boxes: 0
		}
	};

	var family_leaderboard = {};

	_.each(people, function (person) {
		result.boxes_sold += person.data.sold;

		// family leaderboard
		if (!family_leaderboard[person.data.lastname]) {
			family_leaderboard[person.data.lastname] = {
				name: person.data.lastname,
				sold: 0
			};
		}
		family_leaderboard[person.data.lastname].sold += person.data.sold;
	});

	result.top_family = _.max(family_leaderboard, function (item) {
		return item.sold;
	});

	// composite values
	result.money_raised = (result.boxes_sold * config.application.discount_chocolate);
	result.campers_who_could_come_for_free = ((result.money_raised / config.application.fee_junior).toFixed(2));

	return result;

};

person.get_leaderboard = function (cb) {

	// find all people with sold > 0, limit: 10, in decending order of amount sold
	this.find({sold: {$gt: 0}}, function (err, data) {

		if (err) {
			cb(err);
			return;
		}

		cb(null, {
			people: this._calculate_positions(_.first(data, config.application.leaderboard_size)),
			stats: this._calculate_stats(data)
		});

	}.bind(this), null, {sold: -1, firstname: 1});

};

module.exports = person;