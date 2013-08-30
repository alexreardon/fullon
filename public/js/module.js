;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./templates.js":2}],2:[function(require,module,exports){
module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["PUBLIC/JS/TEMPLATE/TEST.HANDLEBARS"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "hello ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " - you rock";
  return buffer;
  });

return this["JST"];

};
},{}]},{},[1])
;