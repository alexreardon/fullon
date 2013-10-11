//namespaces
fullon = {};
fullon.views = {};
fullon.routers = {};

// used to store application state
fullon.state = {};

fullon.views.common = Backbone.View.extend({

	initialize: function () {
		this.$sections = $('section');
		this.$footer = $('footer');
		this.$nav = $('nav');

		var throttled_resize = _.throttle(function () {
			this.resize();
		}.bind(this), 100);

		this.resize();

		$(window).on('resize', function () {
			throttled_resize();
		}.bind(this));
	},

	events: {

	},

	resize: function () {
		console.log('window resize - common');

		var self = this;
		this.$sections.each(function () {
			$(this).css('min-height', self.getMinHeight());
		});

	},

	getMinHeight: function () {
		return ($(window).height() - this.$nav.height() - this.$footer.height());
	}

});

var common_view = new fullon.views.common();