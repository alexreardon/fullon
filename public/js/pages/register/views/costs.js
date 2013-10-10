FullOn.Views.Costs = Backbone.View.extend({

	initialize: function () {

		var radio_discount_selector = 'input[name=chocolate]';
		this.$inputs = $('input:not(' + radio_discount_selector + ')', '#costs ');
		this.$dropdown_toggle = $(radio_discount_selector, '#costs');

		this.$dropdown = $('#discount_chocolate_dropdown', '#costs');

		// attach events
		var self = this;

		this.$dropdown_toggle.on('change', function () {

			var show = ($(this).val() === 'yes');
			self.showDropdown(show);
			self.useDropdown(); //populate initial value

			if (!show) {
				self.setDiscountAmount(self.$dropdown, 0);
			}

		});

		this.$dropdown.on('change', function () {
			self.useDropdown();
		});

		this.$inputs.on('change', function () {
			self.updateDiscountItem($(this));
		});
	},

	updateDiscountItem: function ($el) {
		console.log('input item has been toggled');
		var add = ($el.val() === 'yes');
		var val = (add ? $el.closest('.discount_row').attr('data-value') : '0');

		this.setDiscountAmount($el, val);
	},

	setDiscountAmount: function($el, val){
		$el.closest('.discount_row').find('.discount_amount').text('$' + val);
	},

//	clearDropdown: function () {
//		this.setDiscountAmount(this.$dropdown, 0);
//	},

	useDropdown: function () {
		var val = (parseFloat(this.$dropdown.closest('.discount_row').attr('data-value')) * parseFloat(this.$dropdown.val()));
		this.setDiscountAmount(this.$dropdown, val);
	},

	showDropdown: function (show) {
		this.$dropdown.closest('.form-group').removeClass(show ? 'hide' : 'show').addClass(show ? 'show' : 'hide');
	}

});

