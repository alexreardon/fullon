//namespaces
window.FullOn = {};
FullOn.Views = {};
FullOn.Routers = {};

FullOn.Views.CommonView = Backbone.View.extend({

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

var commonView = new FullOn.Views.CommonView();