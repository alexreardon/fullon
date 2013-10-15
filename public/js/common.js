// namespaces
window.fullon = {};
fullon.views = {};
fullon.views.register = {};

fullon.routers = {};
fullon.routers.register = {};

// events
fullon.vent = {};
_.extend(fullon.vent, Backbone.Events);

// modules
fullon.validation = require('../../util/validation');
// fullon.config could be required but it is bringing in too much stuff

//test:
fullon.validation.is_letters.fn('test');
fullon.validation.min_length.fn('test');

// used to store application state
fullon.state = {};

fullon.views.common = Backbone.View.extend({

	initialize: function () {
		this.$sections = $('section');
		this.$footer = $('footer');
		this.$nav = $('header .navbar');

		var throttled_resize = _.throttle(function () {
			this.resize();
		}.bind(this), 100);

		this.resize();

		$(window).on('resize', function () {
			throttled_resize();
		}.bind(this));

		// start any date pickers
		$('.datepicker').datepicker({
			format: 'dd/mm/yyyy',
			autoclose: true
		});

		// navbar close
		this.$nav.find('a').on('click', function () {
			this.$nav.find('.navbar-collapse').collapse('hide');
		}.bind(this));

	},

	resize: function () {
		console.log('window resize - common');

		var self = this;
		this.$sections.each(function () {
			$(this).css('min-height', self.get_min_height());
		});

	},

	get_min_height: function () {
		return ($(window).height() - this.$nav.height() - this.$footer.height());
	}

});

(function () {
	var common_view = new fullon.views.common();
})();
