var templates = require('../templates.js')(Handlebars);
var schema = require('../../../forms/register/schema');
var FormSection = require('../collection/formsection');

exports = Backbone.View.extend({

	initialize: function() {
		this.sections = [];
		_.each(schema, function(section) {
			this.sections.push(new FormSection(section));
		});
	}


});