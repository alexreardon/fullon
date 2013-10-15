var base_model = require('./base_model'),
	config = require('../config'),
	Chance = require('chance'),
	_ = require('underscore');

var chance = new Chance();

var registration = Object.create(base_model);
registration.collection_name = 'registrations';

registration.create_id = function () {
	return 'FO14-' + chance.string({pool: 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', length: 8});
};

registration.create = function (data, _id) {

	var id = _id || this.create_id();
	// only issue is that this could produce duplicates.
	// mitigation: there will only be around 100-150 registrations.
	return base_model.create.call(this, data, registration.collection_name, null, id);
};

module.exports = registration;