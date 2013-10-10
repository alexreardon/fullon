FullOn.Routers.Register = Backbone.Router.extend({

	routes: {
		'register': 'loadSection',
		'register/:name': 'loadSection'
	},

	initialize: function () {
		this.form = new FullOn.Views.Form();
		this.allegiance = new FullOn.Views.Allegiance();
		this.costs = new FullOn.Views.Costs();

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