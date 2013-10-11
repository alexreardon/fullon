fullon.views.allegiance = Backbone.View.extend({

	initialize: function () {
		this.$camper_types = $('input:radio[name=camper_type]');
		this.$camper_type_labels = $('.camper_type_label');
		this.$camper_type_flags = $('.camper_type_flag');
		this.$camp_fee = $('.camp_fee');

		// attach events
		var self = this;
		$('#allegiance img').on('click', function (event) {
			fullon.state.camper_type = $(this).attr('id');
			self.allegianceToggle();
		});
	},

	constants: {
		flag: (function () {
			var prefix = 'camper_type_flag_';

			return {
				prefix: prefix,
				regex: new RegExp('^' + prefix)
			};
		})()
	},

	allegianceToggle: function () {
		// TODO: 1. warn user if changing type and answers have been filled in

		var self = this;

		// 1. update form
		console.log('selecting camper type: ', fullon.state.camper_type);
		this.$camper_types.each(function () {
			$(this).removeAttr('checked');
		});

		this.$camper_types.filter('[value=' +  fullon.state.camper_type + ']').attr('checked', 'checked');

		// 2. update labels
		this.$camper_type_labels.text(fullon.state.camper_type);

		// 3. update flags
		// 3.1 remove existing flags
		this.$camper_type_flags.each(function () {
			var $this = $(this);

			var clean = [];
			_.each($this.attr('class').split(' '), function (css) {
				// if class starts with camper_type_ then don't add it
				if (!self.constants.flag.regex.test(css)) {
					clean.push(css);
				}
			});

			// add clean classes
			$this.attr('class', clean.join(' '));
		});

		// 3.2 add new class
		this.$camper_type_flags.each(function () {
			$(this).addClass(self.constants.flag.prefix +  fullon.state.camper_type);
		});

		// 4. update fee field
		var fee = fullon.config.camper_types[fullon.state.camper_type].fee;
		this.$camp_fee.text('$' + fee);
	}

});

