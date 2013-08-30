var templates = require('./templates.js')(Handlebars);

console.log(templates);


var Router = Backbone.Router.extend({

	initialize: function(){

	},

	routes: {
		'': 'home',
		'register(/:page)': 'register',
		'*catchall': 'notfound'
	},

	home: function(){
		console.log('hello');
	},

	register: function(page){
		console.log('register - page: ' + page);
	},

	notfound: function(path){
		console.log('404 not found: ' + path);
	}
});

$(function() {
	var router = new Router();
	Backbone.history.start({pushState: true});
});
