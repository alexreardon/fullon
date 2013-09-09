;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports = {
	camper_type: {
		allegiance: {
			type: 'radio',
			info: 'If you are a married leader please fill this form out twice, once for each person',
			options: ['camper', 'leader'],
			validation: {
				required: true
			}
		}
	},
	discounts: {
		chocolate: {
			type: 'select',
			data: null
		},
		early_bird: {
			type: 'radio',
			data: null,
			options: ['yes', 'no'],
			validation: {
				required: true
			}
		},

		married : {
			text: 'are you married?',
			type: 'radio',
			options: ['yes', 'no'],
			conditions: {
				allegiance: 'leader'
			},
			validation: {
				required: true
			}
		}
	}

};


},{}],2:[function(require,module,exports){
var FormItem = require('../model/formitem.js');

var FormSection = Backbone.Collection.extend({
	model: FormItem
});
},{"../model/formitem.js":3}],3:[function(require,module,exports){
/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 4/09/13
 * Time: 8:19 AM
 * To change this template use File | Settings | File Templates.
 */

},{}],4:[function(require,module,exports){
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

},{"../view/registerview":6}],5:[function(require,module,exports){
module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["test"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
},{}],6:[function(require,module,exports){
var templates = require('../templates.js')(Handlebars);
var schema = require('../../../forms/register/schema');
var FormSection = require('../collection/formsection');

exports = Backbone.View.extend({

	initialize: function() {
		this.sections = [];
		_.each(schema, function(section) {
			this.sections.push(new FormSection(section));
		});
	}


});
},{"../../../forms/register/schema":1,"../collection/formsection":2,"../templates.js":5}]},{},[2,3,4,6])
;