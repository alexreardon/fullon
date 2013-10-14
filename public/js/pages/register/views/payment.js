fullon.views.register.payment = Backbone.View.extend({

	initialize: function () {
		this.$payer_radios = $('input[name=is_payer_registering]', '#payment');

		// auto fill fields
		this.$camper_first_name = $('input[name=first_name]', '#basic');
		this.$camper_last_name = $('input[name=last_name]', '#basic');
		this.$camper_email = $('input[name=email]', '#basic');

		this.$payer_first_name = $('input[name=payer_first_name]', '#payment');
		this.$payer_last_name = $('input[name=payer_last_name]', '#payment');
		this.$payer_email = $('input[name=payer_email]', '#payment');


		var self = this;
		this.$payer_radios.on('change', function (event) {
			self.autofill_payer_details();
		});

		fullon.vent.on('basic_info:update', this.autofill_payer_details, this);
	},

	update_autofill_field: function($el, val, disabled){
		$el.val(val).attr('disabled', disabled);
	},

	autofill_payer_details: function () {
		console.log('auto fill details');

		if (this.$payer_radios.filter(':checked').val() === 'yes') { this.update_autofill_field(this.$payer_first_name, this.$camper_first_name.val(), true);
			this.update_autofill_field(this.$payer_last_name, this.$camper_last_name.val(), true);
			this.update_autofill_field(this.$payer_email, this.$camper_email.val(), true);
		} else {
			// clear fields
			this.update_autofill_field(this.$payer_first_name, '', false);
			this.update_autofill_field(this.$payer_last_name, '', false);
			this.update_autofill_field(this.$payer_email, '', false);
		}

	}
});

