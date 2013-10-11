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

