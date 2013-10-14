fullon.views.register.common = Backbone.View.extend({

	initialize: function () {

		this.$inputs = $('input');
		this.$camper_type_radio = $('input[name=camper_type]');
		this.$next_buttons = $('.navigation .btn[data-action=next]');

		var self = this;

		// bind to validation events
		this.listenTo(fullon.vent, 'input:validate', function ($el) {
			self.validate_item($el.closest('.form-group'));

			// if validation has previously failed - check if the 'next' button can now be enabled
			// if there is a field that has not been filled out, then clicking the next button
			// will cause a validation error (good)
			self.check_if_button_can_be_re_enabled($el.closest('section'));
		});

		this.listenTo(fullon.vent, 'input:validate_section', function($section, cb){
			var success = this.validation_section($section);
			cb(success);
		});

		// input change events
		this.$inputs.on('change', function (event) {
			console.log('input [change] event fired');
			var $this = $(this);

			// only look at events caused by date picker
			if ($this.hasClass('datepicker')) {
				fullon.vent.trigger('input:validate', $this);
			}

			// validate on changing radio/checkbox values
			// this fixes an issue where radio buttons can't become valid until focus out
			if ($this.is(':radio') || $this.is(':checkbox')) {
				fullon.vent.trigger('input:validate', $this);
			}

		});
		this.$inputs.on('focusout', function (event) {
			var $this = $(this);

			//ignore events caused by date picker
			if (!$this.hasClass('datepicker')) {
				fullon.vent.trigger('input:validate', $this);
			}
		});

		// navigation event
		this.$next_buttons.on('click', function (event) {
			event.preventDefault();
			event.stopPropagation();
			var $section = $(this).closest('section');

			var success = self.validation_section($section);

			if (success) {
				fullon.vent.trigger('navigate:next', $section);
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

		//enable_navigation_buttons on allegence page
		// this.check_if_page_is_valid(this.$camper_type_radio);
	},

	validation_section: function ($section) {
		// only validate visible items
		var $form_groups = $section.find('.form-group:visible');

		var success = true;

		var self = this;
		$form_groups.each(function () {

			// if any errors, set success to false and continue iterating
			if (!self.validate_item($(this))) {
				success = false;
			}
		});

		this.enable_navigation_buttons($section, success);
		return success;
	},

	validate_item: function ($form_group) {
		var $inputs = $form_group.find('input, textarea, select'),
			val;

		// if checkbox/radio then get the value of the checked option
		if ($inputs.length > 1) {
			val = $form_group.find('input:checked').val();
		} else {
			val = $inputs.val();
		}

		var rules = $form_group.attr('data-validation');

		// no rules for field
		if (!rules) {
			return true;
		}

		rules = rules.split('|');

		var success = true;

		// 1. if required: run checks
		// 2. if not required but there is a value: run checks
		var required = _.contains(rules, 'required:true');

		if (required || (!required && val !== '')) {
			success = _.every(rules, function (rule) {
				var components = rule.split(':');
				var rule_name = components[0];
				var rule_param = components[1];

				return fullon.validation[rule_name].fn(val, rule_param);
			});
		}

		if (success) {
			$form_group.attr('data-valid', true);
			$form_group.removeClass('has-error');
			$form_group.find('.validation_message').removeClass('show').addClass('hide');
		} else {
			$form_group.attr('data-valid', false);
			$form_group.addClass('has-error');
			$form_group.find('.validation_message').removeClass('hide').addClass('show');
		}

		return success;
	},

	check_if_button_can_be_re_enabled: function ($section) {
		var $invalid_groups = $section.find('.form-group[data-valid=false]:visible');

		// invalid group found
		this.enable_navigation_buttons($section, $invalid_groups.length ? false : true);
	},

	enable_navigation_buttons: function ($section, enable) {
		console.log('enable navigation buttons', enable);
		var $navigation = $section.find('.navigation');

		if (enable) {
			// update button
			$navigation.find('.btn[data-action=next]')
				.attr('disabled', false)
				.removeClass('btn-danger');

			$navigation.find('.navigation_cant_continue').addClass('hide');
		} else {
			//update button
			$navigation.find('.btn[data-action=next]')
				.attr('disabled', true)
				.addClass('btn-danger');

			//show warning
			$navigation.find('.navigation_cant_continue').removeClass('hide');
		}
	}

});

