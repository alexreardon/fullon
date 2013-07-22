var Backbone = require('backbone'),
	_ = require('underscore'),
	validation = require('backbone-validation');

_.extend(Backbone.Model.prototype, validation.mixin);

var SomeModel = Backbone.Model.extend({
	validation: {
		name: {
			required: true
		},
		'address.street': {
			required: true
		},
		'address.zip': {
			length: 4
		},
		age: {
			range: [1, 80]
		},
		email: {
			pattern: 'email'
		},
		someAttribute: function(value) {
			if(value !== 'somevalue') {
				return 'Error message';
			}
		}
	}
});

exports.form = {};