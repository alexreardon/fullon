fullon.views.register.common = Backbone.View.extend({

	initialize: function () {

		this.$inputs = $('input');
		this.$camper_type_radio = $('input[name=camper_type]');
		this.$next_buttons = $('.navigation button[data-action=next]');
		this.$form = $('form');

		var self = this;

		// block manual submission
		this.$form.on('submit', function (event) {
			event.preventDefault();
			event.stopPropagation();
			console.log('attempting to submit form');
		});

		// warn before refresh
		window.onbeforeunload = function() {
			return 'Data will be lost if you leave/refresh the page';
		};

		// bind to validation events
		this.listenTo(fullon.vent, 'input:validate', function ($el) {
			self.validate_item($el.closest('.form-group'));

			// if validation has previously failed - check if the 'next' button can now be enabled
			// if there is a field that has not been filled out, then clicking the next button
			// will cause a validation error (good)
			self.check_if_button_can_be_re_enabled($el.closest('section'));
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

			self.validation_section($(this).closest('section'));
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

	},

	validate_item: function ($form_group) {
		var $inputs = $form_group.find('input, textarea'),
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

		// if there is no value and the field is not required
		// don't bother running any checks
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
			$navigation.find('button[data-action=next]')
				.attr('disabled', false)
				.removeClass('btn-danger');

			$navigation.find('.navigation_cant_continue').addClass('hide');
		} else {
			//update button
			$navigation.find('button[data-action=next]')
				.attr('disabled', true)
				.addClass('btn-danger');

			//show warning
			$navigation.find('.navigation_cant_continue').removeClass('hide');
		}
	}

});


fullon.views.register.allegiance = Backbone.View.extend({

	initialize: function () {
		this.$camper_types = $('input:radio[name=camper_type]');
		this.$camper_type_labels = $('.camper_type_label');
		this.$camper_type_flags = $('.camper_type_flag');

		// attach events
		var self = this;
		$('#allegiance img').on('click', function (event) {
			event.stopPropagation();
			self.allegiance_toggle($(this).attr('id'));
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

	allegiance_toggle: function (camper_type) {
		// TODO: 1. warn user if changing type and answers have been filled in

		var self = this;
		fullon.state.camper_type = camper_type;

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

		fullon.vent.trigger('camper_type:change');

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
		this.$camp_fee_total = $(this.selectors.camp_fee_total, this.selectors.section);
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
		// 1. hide rows that are no longer relevant

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

		var visible_discounts = this.$discount_displays.filter(':visible');
		visible_discounts.each(function () {
			fee -= parseFloat($(this).attr(self.selectors.data.current_value));
		});

		if (this.is_donation_input_valid()){
			var donation = parseFloat(this.$donation_input.val());

			if(_.isNumber(donation)){
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
		var val = (fullon.config.discounts[this.$dropdown.attr('name')].amount * parseFloat(this.$dropdown.val()));
		this.set_row_amount(this.$dropdown, show ? val : 0);
	},

	show_dropdown: function (show) {
		this.$dropdown.closest('.form-group').removeClass(show ? 'hide' : 'show').addClass(show ? 'show' : 'hide');
	}

});


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


fullon.routers.register = Backbone.Router.extend({

	routes: {
		'register': 'loadSection',
		'register/:name': 'loadSection'
	},

	initialize: function () {
		this.common = new fullon.views.register.common();
		this.allegiance = new fullon.views.register.allegiance();
		this.costs = new fullon.views.register.costs();
		this.payment = new fullon.views.register.payment();

		this.$sections = $('section');

		this.$navButtons = $('.navButton');
	},

	loadSection: function (name) {

		console.log('attempting to go to :' + name);

		if (!name) {
			return this.navigate('register/allegiance', {trigger: true, replace: true});
		}

//		this.$sections.addClass('hide');
//
//		this.$sections.filter(function () {
//			return ($(this).attr('id') === name);
//		}).removeClass('hide').addClass('show');
	}

});
// registration


(function(){
	function init () {
		var router = new fullon.routers.register();

		Backbone.history.start({
			pushState: true
		});
	}

	init();
})();
