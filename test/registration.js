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

	it('should generate random ids', function () {
		// just checking

		var registrations = [];
		for (var i = 0; i < 20; i++) {
			registrations.push(registration.create({}));
		}

		expect(_.every(registrations, function (reg) {

			return _.every(registrations, function (reg2) {
				if (reg === reg2) {
					return true;
				}
				return reg._id !== reg2._id;
			});
		})).to.be(true);

	});

});
