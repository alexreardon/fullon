var registration = require('../models/registration'),
	base_model = require('../models/base_model'),
	expect = require('expect.js'),
	config = require('../config'),
	_ = require('underscore');

describe('registration', function () {

	var data = [
			{
				foo: 'bar',
				name: 'alex'
			},
			{
				foo: 'bar',
				name: 'ben'
			}
		],
		registrations;

	beforeEach(function () {
		registrations = [];
		_.each(data, function (item) {
			registrations.push(registration.create(item));
		});
	});

	it('Should be an instance of base_model', function () {
		var r = registration.create(data[0]);
		expect(r.prototype).to.be(registration.prototype);
		expect(r.prototype).to.be(base_model.prototype);
	});

});
