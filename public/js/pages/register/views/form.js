fullon.views.form = Backbone.View.extend({

	initialize: function () {

		this.$inputs = $('input');

		// attach events
		var self = this;


		this.$inputs.on('focusout', function () {
			self.validate($(this));
		});
	},

	processPage: function () {
		// 1. if all fields are valid allow user to navigate to next section
		// 2. check if any conditional fields need to be enabled/disabled;
	},

	validate: function () {
		// 1. check if fi
		// if all validation rules pass on page then enable the 'next' button

	}
});

