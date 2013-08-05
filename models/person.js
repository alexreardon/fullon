var baseModel = require('./baseModel');


var person = Object.create(baseModel);
person.collection_name = 'people';
person.searchKeys = ['firstname', 'lastname'];

person.create = function(data){

	data.sold = data.sold || 0;
	data.attributed = data.attributed || 0;

	return baseModel.create.call(this, data, person.collection_name, person.searchKeys);
};

module.exports = person;