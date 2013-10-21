var registration = require('../../models/registration'),
	base_model = require('../../models/base_model'),
	expect = require('expect.js'),
	config = require('../../config'),
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
			registrations.push(registration.create({data: item}));
		});
	});

	it('Should be an instance of base_model', function () {
		var r = registration.create({data: data[0]});
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

	it('should get first initial', function () {
		expect(registration.get_initial('Alex')).to.be('A');
		expect(registration.get_initial('ben')).to.be('B');
	});

	it('should return "X" when invalid data passed to get_initial', function () {
		expect(registration.get_initial(5)).to.be('X');
		expect(registration.get_initial(null)).to.be('X');
		expect(registration.get_initial('')).to.be('X');
	});

});
