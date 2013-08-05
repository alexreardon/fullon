var baseModel = require('./baseModel'),
	collection_name = 'people';


var person = Object.create(baseModel);

person.create = function(data){
	return baseModel.create.call(this, data, collection_name);
};




module.exports = person;