fullon.views.register.payment = Backbone.View.extend({

	initialize: function () {
		this.$payer_radio = $('input[name=is_payer_registering]', '#payment');

		var self = this;
		this.$payer_radio.on('change', function (event) {
			self.autofill_payer_details();
		});
	},

	autofill_payer_details: function () {
		console.log('auto fill details');

		if (this.$payer_radio.val() === 'yes') {
			// autofill fields
		} else {
			// clean fields
		}

	}
});

