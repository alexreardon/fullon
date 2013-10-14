// although this is a 'router' it is not using the backbone routing functionality.
// this is because navigation is tightly coupled validation

fullon.routers.register = Backbone.Router.extend({

	initialize: function () {
		this.common = new fullon.views.register.common();
		this.allegiance = new fullon.views.register.allegiance();
		this.costs = new fullon.views.register.costs();
		this.basic = new fullon.views.register.basic();
		this.payment = new fullon.views.register.payment();

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
		} else {
			$current_tab.addClass('partially_completed');
		}

		var $next_tab = this.$nav_buttons.find('a[data-section=' + $next.attr('id') + ']').closest('li');
		$next_tab.removeClass('pending done').addClass('active');

		$current.hide();
		$next.show();
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