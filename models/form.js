var Backbone = require('backbone'),
	_ = require('underscore'),
	validation = require('backbone-validation');

_.extend(Backbone.Model.prototype, validation.mixin);

var FormModel = Backbone.Model.extend({
	validation: {
		name: {
			required: true
		},
		age: {
			range: [10, 80]
		},
		email: {
			pattern: 'email'
		}
	}
});

var FormView = Backbone.View.extend({});

var view = new FormView({model: new FormModel()});

exports.form = {};