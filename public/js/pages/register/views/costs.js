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

