var base_model = require('./base_model'),
	config = require('../config'),
	_ = require('underscore');


var person = Object.create(base_model);
person.collection_name = 'people';
person.searchKeys = ['firstname', 'lastname'];

person.create = function(data){

	data.sold = data.sold || 0;
	data.attributed = data.attributed || 0;

	return base_model.create.call(this, data, person.collection_name, person.searchKeys);
};

person._calculate_positions = function(people){
	//precondition - data is sorted {sold: -1, firstname: 1}

	var position = 0,
		lastSold = null;

	_.each(people, function(prsn){
		if(prsn.data.sold !== lastSold){
			lastSold = prsn.data.sold;
			position++;
		}
		prsn.temp.position = position;
	});

	return people;

};

person.get_leaderboard = function(cb){

	//find all people with sold > 0, limit: 10, in decending order of amount sold
	this.find({sold: {$gt: 0}}, function(err, data){

		if(err){
			cb(err);
			return;
		}
		cb(null, this._calculate_positions(data));

	}.bind(this), config.leaderboard_size, {sold: -1, firstname: 1});
};

module.exports = person;