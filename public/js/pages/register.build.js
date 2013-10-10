FullOn.Views.Form = Backbone.View.extend({

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


FullOn.Views.Allegiance = Backbone.View.extend({

	initialize: function () {
		this.$camper_types = $('input:radio[name=camper_type]');
		this.$camper_type_labels = $('.camper_type_label');
		this.$camper_type_flags = $('.camper_type_flag');

		// attach events
		var self = this;
		$('#allegiance img').on('click', function () {
			self.allegianceToggle($(this).attr('id'));
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

	allegianceToggle: function (id) {
		// TODO: 1. warn user if changing type and answers have been filled in

		var self = this;

		// 1. update form
		console.log('selecting camper type: ', id);
		this.$camper_types.each(function () {
			$(this).removeAttr('checked');
		});

		this.$camper_types.filter('[value=' + id + ']').attr('checked', 'checked');

		// 2. update labels
		this.$camper_type_labels.text(id);

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
			$(this).addClass(self.constants.flag.prefix + id);
		});
	}

});


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


FullOn.Routers.Register = Backbone.Router.extend({

	routes: {
		'register': 'loadSection',
		'register/:name': 'loadSection'
	},

	initialize: function () {
		this.form = new FullOn.Views.Form();
		this.allegiance = new FullOn.Views.Allegiance();
		this.costs = new FullOn.Views.Costs();

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
function init () {
	var router = new FullOn.Routers.Register();

	Backbone.history.start({
		pushState: true
	});
}

init();