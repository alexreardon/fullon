var person = require('../models/person'),
	baseModel = require('../models/baseModel'),
	expect = require('expect.js');


describe('person', function(){

	var data = {
		firstname: 'Alex',
		lastname: 'Reardon',
		sold: 1,
		attributed: 0
	};

	it('Should be an instance of baseModel', function(){
		var p = person.create(data);
		expect(p.prototype).to.be(person.prototype);
		expect(p.prototype).to.be(baseModel.prototype);
	});
});
