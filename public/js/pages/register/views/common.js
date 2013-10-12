fullon.views.register.common = Backbone.View.extend({

	initialize: function () {

		this.$inputs = $('input');
		this.$inputs.on('change', function (event) {
			console.log('input [change] event fired');
			var $this = $(this);
			//ignore events caused by date picker
			if ($this.hasClass('datepicker')) {
				fullon.vent.trigger('input:validate', $this);
			}
		});

		// bind to validation events
		this.listenTo(fullon.vent, 'input:validate', this.on_input_change);
		this.$inputs.on('focusout', function (event) {
			var $this = $(this);

			//ignore events caused by date picker
			if (!$this.hasClass('datepicker')) {
				fullon.vent.trigger('input:validate', $this);
			}
		});

		// form containers (groups)
		this.$form_groups = $('.form-group');
		fullon.vent.on('camper_type:change', this.on_camper_type_change, this);
	},

	on_camper_type_change: function () {
		var camper_type = fullon.state.camper_type;
		// show all form groups with type in  data-available-to="type1|type2.."
		this.$form_groups.each(function () {
			var $this = $(this);
			var available_to = $this.attr('data-available-to');

			if (!available_to) {
				return true;
			}

			available_to = available_to.split('|');

			if (_.contains(available_to, camper_type)) {
				$this.show();

				// discount rows
				$this.closest('.discount_row').show();
			} else {
				$this.hide();

				// discount rows
				$this.closest('.discount_row').hide();
			}

		});
	},

	on_input_change: function ($el) {
		// 1. get rules from parent .form-group
		// 2. apply rules
		// 3. display validation message if required
		var parent = $el.closest('.form-group');

		var rules = parent.attr('data-validation');

		// no rules for field
		if (!rules) {
			return this.check_if_page_is_valid($el);
		}

		rules = rules.split('|');

		var failure = _.some(rules, function (rule) {
			var components = rule.split(':');
			var rule_name = components[0];
			var rule_param = components[1];

			return !fullon.validation[rule_name].fn($el.val(), rule_param);

		});

		if (failure) {
			parent.attr('data-valid', false);
			parent.addClass('has-error');
			parent.find('.validation_message').removeClass('hide').addClass('show');
		} else {
			parent.attr('data-valid', true);
			parent.removeClass('has-error');
			parent.find('.validation_message').removeClass('show').addClass('hide');
		}

		//check if page is valid for navigation
		this.check_if_page_is_valid($el);
	},

	check_if_page_is_valid: function ($el) {
		var $section = $el.closest('section');
		var $invalid_groups = $section.find('.form-group[data-valid=false]:visible');

		// invalid group found
		this.enable_navigation_buttons($invalid_groups.length ? false : true);
	},

	enable_navigation_buttons: function (enable) {
		console.log('enable navigation buttons', enable);
	}

});

