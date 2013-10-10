var IndexView = Backbone.View.extend({

	initialize: function () {
		this.$landing = $('#landing');
		this.resize();
		$(window).on('resize', function(){
			this.resize();
		}.bind(this));
	},

	events: {

	},

	resize: function () {
		this.$landing.css('min-height', $(window).height());
	}


});

var index = new IndexView();

