fullon.routers.register = Backbone.Router.extend({

	routes: {
		'register': 'loadSection',
		'register/:name': 'loadSection'
	},

	initialize: function () {
		this.common = new fullon.views.register.common();
		this.allegiance = new fullon.views.register.allegiance();
		this.costs = new fullon.views.register.costs();
		this.payment = new fullon.views.register.payment();

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