;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// namespaces
window.fullon = {};
fullon.views = {};
fullon.views.register = {};

fullon.routers = {};
fullon.routers.register = {};

// events
fullon.vent = {};
_.extend(fullon.vent, Backbone.Events);

// modules
fullon.validation = require('../../util/validation');
// fullon.config could be required but it is bringing in too much stuff

//test:
fullon.validation.is_letters.fn('test');
fullon.validation.min_length.fn('test');

// used to store application state
fullon.state = {};

fullon.views.common = Backbone.View.extend({

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

		// start any date pickers
		$('.datepicker').datepicker({
			format: 'dd/mm/yyyy',
			autoclose: true
		});
	},

	events: {

	},

	resize: function () {
		console.log('window resize - common');

		var self = this;
		this.$sections.each(function () {
			$(this).css('min-height', self.getMinHeight());
		});

	},

	getMinHeight: function () {
		return ($(window).height() - this.$nav.height() - this.$footer.height());
	}

});

(function(){
	var common_view = new fullon.views.common();
})();

},{"../../util/validation":2}],2:[function(require,module,exports){
var regex = {
	email: /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
	number: /^\d+$/,
	letters: /^[a-zA-Z]+[a-zA-Z\s]*$/,
	date: /^[\d]{2}\/[\d]{2}\/[\d]{4}$/ // DD/MM/YYYY
};

var rules = {
	min_length: {
		fn: function(input, length) {
			return (input && input.length && input.length >= length) || false;
		},
		text: 'must be at least {0} characters in length'
	},
	max_length: {
		fn: function(input, length) {
			return (input && input.length && input.length <= length) || false;
		},
		text: 'cannot be longer then {0} characters'
	},
	required: {
		fn: function(input) {
			return (input && input.length && input.length > 0) || false;
		},
		text: 'this is a required field'
	},
	is_letters: {
		fn: function(input) {
			return regex.letters.test(input);
		},
		text: 'must be letters only'
	},
	is_numbers: {
		fn: function(input) {
			return regex.number.test(input);
		},
		text: 'must be numbers only'
	},
	is_email: {
		fn: function(input) {
			return regex.email.test(input);
		},
		text: 'must be in email format (eg \'example@email.com\')'
	},
	is_date: {
		fn: function(input) {
			return regex.date.test(input);
		},
		text: 'date is expected the following format: DD/MM/YYYY'
	}
};

// export for client and server side usage
module.exports = exports = rules;



},{}]},{},[1])
;