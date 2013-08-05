var baseModel = require('./baseModel'),
	collection_name = 'people',
	searchKeys = ['firstname', 'lastname'];


var person = Object.create(baseModel);

person.create = function(data){
	return baseModel.create.call(this, data, collection_name, searchKeys);
};

module.exports = person;