var base_model = require('./base_model'),
	config = require('../config'),
	_ = require('underscore');

var registration = Object.create(base_model);
registration.collection_name = 'registrations';
registration.search_keys = [];

registration.create = function (data) {

	data.sold = data.sold || 0;
	data.attributed = data.attributed || 0;

	return base_model.create.call(this, data, registration.collection_name, registration.search_keys);
};

module.exports = registration;