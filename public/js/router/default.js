var RegisterView = require('../view/register');
var IndexView = require('../view/index');

var DefaultRouter = Backbone.Router.extend({

	initialize: function(){
		//this.indexView = new IndexView();
		this.registerView = new RegisterView();
	},

	routes: {
		'': 'index',
		'register(/:page)': 'register',
		'*catchall': 'notfound'
	},

	index: function() {
		console.log('index');
		//this.indexView.render();
	},

	register: function(page) {
		console.log('registration page');
	},

	notfound: function(path) {
		console.log('404 not found: ' + path);
	}
});

var router = new DefaultRouter();
