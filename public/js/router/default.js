var RegisterView = require('../view/registerview');

var DefaultRouter = Backbone.Router.extend({

	initialize: function(){
		this.registerView = new RegisterView();
	},

	routes: {
		'': 'home',
		'register(/:page)': 'register',
		'*catchall': 'notfound'
	},

	home: function() {
		console.log('hello');
	},

	register: function(page) {
		console.log('registration page');
	},

	notfound: function(path) {
		console.log('404 not found: ' + path);
	}
});

var router = new DefaultRouter();
