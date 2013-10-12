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

