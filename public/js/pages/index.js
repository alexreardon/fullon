window.FullOn.Views.Index = Backbone.View.extend({

	initialize: function () {
		this.$landing = $('#landing');

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
		this.$landing.css('min-height', $(window).height());
	}

});

var index = new window.FullOn.Views.Index();

