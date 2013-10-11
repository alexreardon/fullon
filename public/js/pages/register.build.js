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


fullon.views.costs = Backbone.View.extend({

	selectors: {
		section: '#costs',
		radio_discount: 'input[name=chocolate]',
		dropdown: '#discount_chocolate_dropdown',
		camp_fee: '.camp_fee',
		camp_fee_total: '.camp_fee_total',
		discount_row: '.discount_row',
		discount_display: '.discount_amount',

		data: {
			base_value: 'data-base-value',
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
			self.showDropdown(show);
			self.useDropdown(); //populate initial value

			if (!show) {
				self.setDiscountAmount(self.$dropdown, 0);
			}

		});

		this.$dropdown.on('change', function (event) {
			self.useDropdown();
		});

		this.$inputs.on('change', function (event) {
			self.updateDiscountItem($(this));
		});

		//listen for event
	},

	updateDiscountItem: function ($el) {
		console.log('input item has been toggled');
		var name = $el.attr('name');
		var add = ($el.val() === 'yes');
		var val = (add ? fullon.config.discounts[name].amount : 0);

		this.setDiscountAmount($el, val);
	},

	setDiscountAmount: function ($el, val) {
		var self = this;

		// update element
		$el.closest(this.selectors.discount_row).find(this.selectors.discount_display)
			.attr(this.selectors.data.current_value, val)
			.text('$' + val);

		this.updateFeeTotal();

	},

	updateFeeTotal: function () {
		// update total
		var fee = fullon.config.camper_types[fullon.state.camper_type].fee;
		this.$discount_displays.each(function () {
			fee -= parseFloat($(this).attr(self.selectors.data.current_value));
		});
		this.$camp_fee_total
			.attr(this.selectors.data.current_value, fee)
			.text('$' + fee);
	},

//	clearDropdown: function () {
//		this.setDiscountAmount(this.$dropdown, 0);
//	},

	useDropdown: function () {
		var val = (parseFloat(this.$dropdown.closest(this.selectors.discount_row).attr(this.selectors.data.current_value)) * parseFloat(this.$dropdown.val()));
		this.setDiscountAmount(this.$dropdown, val);
	},

	showDropdown: function (show) {
		this.$dropdown.closest('.form-group').removeClass(show ? 'hide' : 'show').addClass(show ? 'show' : 'hide');
	}

});


fullon.routers.register = Backbone.Router.extend({

	routes: {
		'register': 'loadSection',
		'register/:name': 'loadSection'
	},

	initialize: function () {
		this.form = new fullon.views.form();
		this.allegiance = new fullon.views.allegiance();
		this.costs = new fullon.views.costs();

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
(function(){
	function init () {
		var router = new fullon.routers.register();

		Backbone.history.start({
			pushState: true
		});
	}

	init();
})();
