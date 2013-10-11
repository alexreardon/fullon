fullon.routers.register = Backbone.Router.extend({

	routes: {
		'register': 'loadSection',
		'register/:name': 'loadSection'
	},

	initialize: function () {
		this.$sections = $('section');
	},

	// routes
	loadSection: function (name) {

		console.log('attempting to go to :' + name);

		if (!name) {
			return this.navigate('/register/allegiance', {trigger: true, replace: true});
		}

		this.$sections.addClass('hide');

		this.$sections.filter(function () {
			return ($(this).attr('id') === name);
		}).removeClass('hide').addClass('show');
	}

	//

});