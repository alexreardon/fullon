FullOn.Views.Allegiance = Backbone.View.extend({

	initialize: function () {
		this.$camper_types = $('input:radio[name=camper_type]');
		this.$camper_type_labels = $('.camper_type_label');
		this.$camper_type_flags = $('.camper_type_flag');

		// attach events
		var self = this;
		$('#allegiance img').on('click', function () {
			self.allegianceToggle($(this).attr('id'));
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

	allegianceToggle: function (id) {
		// TODO: 1. warn user if changing type and answers have been filled in

		var self = this;

		// 1. update form
		console.log('selecting camper type: ', id);
		this.$camper_types.each(function () {
			$(this).removeAttr('checked');
		});

		this.$camper_types.filter('[value=' + id + ']').attr('checked', 'checked');

		// 2. update labels
		this.$camper_type_labels.text(id);

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
			$(this).addClass(self.constants.flag.prefix + id);
		});
	}

});

