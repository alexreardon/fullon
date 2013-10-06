//namespaces
window.FullOn = {};
window.FullOn.Views = {};

window.FullOn.Views.CommonView = Backbone.View.extend({

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

//		this.$sections.each(function($section){
//			console.log('section!');
//			$section.css('min-height', function(){
//				this.getMinHeight();
//			}.bind(this));
//		}.bind(this));

		var self = this;
		this.$sections.each(function(){
			$(this).css('min-height', self.getMinHeight());
		});

//		_.each(this.$sections, function(section){
//			$(section).css('min-height', function(){
//				this.getMinHeight();
//			}.bind(this));
//		}.bind(this));
	},

	getMinHeight: function () {
		return ($(window).height() - this.$nav.height() - this.$footer.height());
	}

});

var commonView = new window.FullOn.Views.CommonView();