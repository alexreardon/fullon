var base_model = require('./base_model'),
	config = require('../config'),
	Chance = require('chance'),
	format = require('util').format,
	_ = require('underscore');

var chance = new Chance();

var registration = Object.create(base_model);
registration.collection_name = 'registrations';

registration.get_initial = function (string) {
	if (string && _.isString(string) && string.length > 0) {
		return string.charAt(0).toUpperCase();
	}

	return 'X';
};

registration.create_id = function (first_name, last_name) {
	// FORMAT:
	// FO14-FirstInitialLastInitial-RandomString

	// max this can ever be is 18 characters
	// currently it is: FO14-XX-123456 (14)
	var first_initial = this.get_initial(first_name),
		last_initial = this.get_initial(last_name),
		random = chance.string({pool: 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', length: 6});

	return format('%s-%s%s-%s', 'FO14', first_initial, last_initial, random);
};

registration.create = function (data, _id) {

	var id = _id || this.create_id();
	// only issue is that this could produce duplicates.
	// mitigation: there will only be around 100-150 registrations.
	return base_model.create.call(this, data, registration.collection_name, null, id);
};

module.exports = registration;