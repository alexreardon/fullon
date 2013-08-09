var baseModel = require('./baseModel'),
	config = require('../config'),
	_ = require('underscore');


var person = Object.create(baseModel);
person.collection_name = 'people';
person.searchKeys = ['firstname', 'lastname'];

person.create = function(data){

	data.sold = data.sold || 0;
	data.attributed = data.attributed || 0;

	return baseModel.create.call(this, data, person.collection_name, person.searchKeys);
};

person._calculatePositions = function(people){
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
		cb(null, this._calculatePositions(data));

	}.bind(this), config.leaderboard_size, {sold: -1, firstname: 1});
};

module.exports = person;