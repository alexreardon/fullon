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


		fullon.state.camper_type = camper_type;
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
		discount_row: '.discount_row',
		discount_display: '.discount_amount',

		data: {
			current_value: 'data-current-value'
		}

	},
	initialize: function () {

		this.$inputs = $('input:not(' + this.selectors.radio_discount + ')', this.selectors.section);
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

		this.$inputs.on('change', function (event) {
			self.update_discount_item($(this));
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

	update_discount_item: function ($el) {
		console.log('input item has been toggled');
		var name = $el.attr('name');
		var add = ($el.val() === 'yes');
		var val = (add ? fullon.config.discounts[name].amount : 0);

		this.set_discount_amount($el, val);
	},

	set_discount_amount: function ($el, val) {
		var self = this;

		// update element
		$el.closest(this.selectors.discount_row).find(this.selectors.discount_display)
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

		// can't let fee be less than 0
		fee = (fee < 0 ? 0 : fee);

		this.$camp_fee_total
			.attr(this.selectors.data.current_value, fee)
			.text('$' + fee);
	},

	use_dropdown: function (show) {
		var val = (fullon.config.discounts[this.$dropdown.attr('name')].amount * parseFloat(this.$dropdown.val()));
		this.set_discount_amount(this.$dropdown, show ? val : 0);
	},

	show_dropdown: function (show) {
		this.$dropdown.closest('.form-group').removeClass(show ? 'hide' : 'show').addClass(show ? 'show' : 'hide');
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
