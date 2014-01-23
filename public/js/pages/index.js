fullon.views.index = Backbone.View.extend({

	initialize: function () {
		this.$full_page_sections = $('.full_page');

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
		console.log('window resize - landing');
		this.$full_page_sections.css('min-height', $(window).height());
	}

});

var index = new fullon.views.index();

