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
		// all input events are now fired by 'change' and not a mixture of change and focus out
		this.$inputs.on('change', function (event) {
			console.log('input [change] event fired');
			fullon.vent.trigger('input:validate', $(this));
		});
		this.$inputs.on('focusout', function (event) {
			console.log('input [focusout] event fired - not processing');
			return;
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
				$this.removeClass('hide');

				// discount rows
				$this.closest('.discount_row').removeClass('hide');
			} else {
				$this.addClass('hide');

				// discount rows
				$this.closest('.discount_row').addClass('hide');
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


fullon.views.register.allegiance = Backbone.View.extend({

	initialize: function () {
		this.$section = $('#allegiance');
		this.$camper_types = $('input:radio[name=camper_type]');
		this.$camper_type_labels = $('.camper_type_label');
		this.$camper_type_flags = $('.camper_type_flag');
		this.$navigation_button_container = $('#allegiance_navigation_container', '#allegiance');
		this.$camper_type_row = $('#camper_type_row', '#allegiance');

		// attach events
		var self = this;
		$('#allegiance img').on('click', function (event) {
			event.stopPropagation();
			self.allegiance_toggle($(this).attr('id'));
		});

		// turn on flags: we are now ready
		this.$camper_type_row.removeClass('invisible');
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

	allegiance_toggle: function (camper_type) {
		// TODO: 1. warn user if changing type and answers have been filled in

		var self = this;
		fullon.state.camper_type = camper_type;

		// 1. update form
		console.log('selecting camper type: ', fullon.state.camper_type);
		this.$camper_types.each(function () {
			$(this).prop('checked', false);
		});

		this.$camper_types.filter('[value=' + fullon.state.camper_type + ']').prop('checked', true);

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
			$(this).addClass(self.constants.flag.prefix + fullon.state.camper_type);
		});

		// 4. enable prev/next buttons
		// disabled: now just navigation straight away
		// having the buttons appear was not intuitive for mobile
		//this.$navigation_button_container.removeClass('invisible');

		fullon.vent.trigger('camper_type:change');

		// 5. can now navigate to the next page
		fullon.vent.trigger('navigate:next', this.$section);

	}

});


fullon.views.register.costs = Backbone.View.extend({

	selectors: {
		section: '#costs',
		radio_discount: 'input[name=chocolate]',
		dropdown: '#discount_chocolate_dropdown',
		camp_fee: '.camp_fee',
		camp_fee_total: '.camp_fee_total',
		row: '.row',
		discount_display: '.discount_amount',
		row_amount_display: '.amount_display',

		data: {
			current_value: 'data-current-value'
		}

	},
	initialize: function () {

		this.$discount_inputs = $('input:radio:not(' + this.selectors.radio_discount + ')', this.selectors.section);
		this.$donation_input = $('input[name=donation]');

		this.$dropdown_toggle = $(this.selectors.radio_discount, this.selectors.section);
		this.$dropdown = $(this.selectors.dropdown, this.selectors.section);
		this.$camp_fee = $(this.selectors.camp_fee, this.selectors.section);
		this.$camp_fee_total = $(this.selectors.camp_fee_total); // will also update total on payment page
		this.$discount_displays = $(this.selectors.discount_display, this.selectors.section);
		// attach events
		var self = this;

		this.$dropdown_toggle.on('change', function (event) {

			var show = ($(this).val() === 'yes');
			self.show_dropdown(show);
			self.use_dropdown(show); //populate initial value

		});

		this.$dropdown.on('change', function (event) {
			self.use_dropdown(true);
		});

		this.$discount_inputs.on('change', function (event) {
			self.update_discount_item($(this));
		});

		this.$donation_input.on('focusout', function () {
			self.update_donantion_item();
		});

		//listen for event
		this.listenTo(fullon.vent, 'camper_type:change', this.on_camper_type_change);

	},

	on_camper_type_change: function () {
		// 1. update total
		var fee = fullon.config.camper_types[fullon.state.camper_type].fee;
		this.$camp_fee.attr(this.selectors.data.current_value, fee);
		this.$camp_fee.text('$' + fee);

		// 2. set initial total
		this.update_fee_total();
	},

	is_donation_input_valid: function () {
		return ( !this.$donation_input.closest('.form-group[data-valid=false]').length &&
			this.$donation_input.val() !== '');
	},

	update_donantion_item: function () {
		// allow validation item to run first
		setTimeout(function () {

			if (!this.is_donation_input_valid()) {
				return this.set_row_amount(this.$donation_input, 0);
			}

			return this.set_row_amount(this.$donation_input, this.$donation_input.val());

		}.bind(this), 0);
	},

	update_discount_item: function ($el) {
		console.log('input item has been toggled');
		var name = $el.attr('name');
		var add = ($el.val() === 'yes');
		var val = (add ? fullon.config.discounts[name].amount : 0);

		this.set_row_amount($el, val);
	},

	set_row_amount: function ($el, val) {
		var self = this;

		// update element
		$el.closest(this.selectors.row).find(this.selectors.row_amount_display)
			.attr(this.selectors.data.current_value, val)
			.text('$' + val);

		this.update_fee_total();

	},

	update_fee_total: function () {
		// update total
		var self = this;

		var fee = fullon.config.camper_types[fullon.state.camper_type].fee;

		// this can be triggered while the page is not visible.

		var visible_discounts = this.$discount_displays.filter(function(){
			return !($(this).closest('.form-group').hasClass('hide'));
		});

		visible_discounts.each(function () {
			fee -= parseFloat($(this).attr(self.selectors.data.current_value));
		});

		if (this.is_donation_input_valid()) {
			var donation = parseFloat(this.$donation_input.val());

			if (_.isNumber(donation)) {
				fee += donation;
			}

		}

		// can't let fee be less than 0
		fee = (fee < 0 ? 0 : fee);

		this.$camp_fee_total
			.attr(this.selectors.data.current_value, fee)
			.text('$' + fee);
	},

	use_dropdown: function (show) {
		var val = (fullon.config.discounts.chocolate.amount * parseFloat(this.$dropdown.val()));
		this.set_row_amount(this.$dropdown, show ? val : 0);

		if (show) {
			var $selected = $(this.$dropdown.find(':selected'));
			fullon.vent.trigger('chocolate_dropdown:change', {
				first_name: $selected.attr('data-first-name'),
				last_name: $selected.attr('data-last-name')
			});
		}
	},

	show_dropdown: function (show) {
		this.$dropdown.closest('.form-group').removeClass(show ? 'hide' : 'show').addClass(show ? 'show' : 'hide');

		if (!show) {
			fullon.vent.trigger('chocolate_dropdown:remove');
		}
	}

});


fullon.views.register.basic = Backbone.View.extend({

	initialize: function () {

		this.$basic_fields = $('input[name=first_name], input[name=last_name], input[name=email]', '#basic');

		this.$basic_fields.on('change', function () {
			console.log('basic info updated - update auto complete fields');
			fullon.vent.trigger('basic_info:update');
		});

		fullon.vent.on('chocolate_dropdown:change', this.on_chocolate_dropdown_change, this);
		fullon.vent.on('chocolate_dropdown:remove', this.on_chocolate_dropdown_remove, this);

	},

	on_chocolate_dropdown_remove: function () {
		console.log('basic: on_chocolate_dropdown_remove');
		this.$basic_fields.filter('[name=first_name]').val('').attr('disabled', false);
		this.$basic_fields.filter('[name=last_name]').val('').attr('disabled', false);
	},

	on_chocolate_dropdown_change: function (data) {
		console.log('basic: on_chocolate_dropdown_change', data);
		this.$basic_fields.filter('[name=first_name]').val(data.first_name).attr('disabled', true).trigger('change');
		this.$basic_fields.filter('[name=last_name]').val(data.last_name).attr('disabled', true).trigger('change');

		// let other views know that the basic info has updated
		fullon.vent.trigger('basic_info:update');
	}
});


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

	update_autofill_field: function ($el, val, disabled) {
		$el.val(val).attr('disabled', disabled);
		if (disabled) {
			$el.trigger('change');
		}
	},

	autofill_payer_details: function () {
		console.log('auto fill details');

		if (this.$payer_radios.filter(':checked').val() === 'yes') {
			this.update_autofill_field(this.$payer_first_name, this.$camper_first_name.val(), true);
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


// although this is a 'router' it is not using the backbone routing functionality.
// this is because navigation is tightly coupled validation

fullon.routers.register = Backbone.Router.extend({

	initialize: function () {
		this.common = new fullon.views.register.common();
		this.allegiance = new fullon.views.register.allegiance();
		this.costs = new fullon.views.register.costs();
		this.basic = new fullon.views.register.basic();
		this.payment = new fullon.views.register.payment();

		this.$body = $('body');
		this.$form = $('form');
		this.$sections = $('section');
		this.$all_inputs = $('input, textarea, select');

		// nav buttons
		this.$nav_buttons = $('#register_nav .nav li');
		this.$back_buttons = $('.navigation .btn[data-action=back]');

		// warn before refresh
		var bypass_refresh_check = false;
		window.onbeforeunload = function () {
			if (!bypass_refresh_check) {
				bypass_refresh_check = false;
				return 'Data will be lost if you leave/refresh the page';
			}

		};

		// Attached to events

		var self = this;

		// block manual form submission
		this.$form.on('submit', function (event) {
			console.log('attempting to submit form');
			// enabled all disabled fields for submission
			self.$all_inputs.attr('disabled', false);
			bypass_refresh_check = true;
		});

		this.$back_buttons.on('click', function (event) {
			event.preventDefault();
			event.stopPropagation();

			var $section = $(this).closest('section');
			self.on_navigate_previous($section);
		});

		this.$nav_buttons.find('a').on('click', function (event) {
			event.preventDefault();
			event.stopPropagation();

			self.on_nav_button_click($(this).closest('li'));
		});

		// listen to events
		this.listenTo(fullon.vent, 'navigate:next', this.on_navigate_next);
		this.listenTo(fullon.vent, 'camper_type:change', this.on_camper_type_change);

	},

	navigate_ui: function ($current, $next, forward) {

		// remove active class
		var $current_tab = this.$nav_buttons.find('a[data-section=' + $current.attr('id') + ']').closest('li');
		$current_tab.removeClass('active');

		if (forward) {
			$current_tab.removeClass('partially_completed').addClass('done');
		} else if (!$current_tab.hasClass('done')) {
			$current_tab.addClass('partially_completed');
		}

		var $next_tab = this.$nav_buttons.find('a[data-section=' + $next.attr('id') + ']').closest('li');
		$next_tab.removeClass('pending').addClass('active');

		$current.hide();
		$next.show();

		//snap to top of page
		this.$body.scrollTop(0);
	},

	on_navigate_previous: function ($section) {

		var $prev = $section.prev();
		if ($prev.length) {
			this.navigate_ui($section, $prev, false);
		}
	},

	on_navigate_next: function ($section) {
		// at this stage we can we sure that we can navigate to the next section

		var $next = $section.next();
		if ($next.length) {
			return this.navigate_ui($section, $next, true);
		}

		// on the last section - we can submit
		this.$form.submit();

	},

	on_nav_button_click: function ($li) {
		if ($li.hasClass('pending')) {
			return;
		}

		// get current section
		var $current_section = this.$sections.filter(':visible');

		// get target section
		var target_id = $li.find('a').attr('data-section');

		// clicked the link of the current section
		// don't need to do anything
		if (target_id === $current_section.attr('id')) {
			return;
		}

		var $target_section = this.$sections.filter(function () {
			return ($(this).attr('id') === target_id);
		});

		// get direction of navigation
		var forward = (this.$sections.index($current_section) < this.$sections.index($target_section));

		// if going forward - need to validate current page
		fullon.vent.trigger('input:validate_section', $current_section, function (success) {
			if (!forward) {
				return this.navigate_ui($current_section, $target_section, false);
			}

			if (success) {
				$li.removeClass('partially_complete');
				this.navigate_ui($current_section, $target_section, true);
			} else {
				window.alert('cannot continue forward until this section is valid');
			}
		}.bind(this));

	},

	on_camper_type_change: function () {
		// invalidate all nav icons (they can't be valid any more! the questions have changed!)
		// could do a warning here

		// this will now force the user to use the next buttons

		var first = true;
		this.$nav_buttons.each(function () {
			if (first) {
				first = false;
				return;
			}

			$(this).removeClass('partially_completed done').addClass('pending');

		});
	}

});
// registration


(function(){
	function init () {
		var router = new fullon.routers.register();
	}

	init();
})();
