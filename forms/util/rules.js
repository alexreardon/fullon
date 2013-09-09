var regex = {
	email: /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
	number: /^\d+$/,
	letters: /^[a-zA-Z]+$/
};

exports = {
	min_length: {
		fn: function(input, length) {
			return (this.is_letters(input) && (input.length && input.length >= length));
		},
		text: 'must be at least {0} characters in length'
	},
	max_length: {
		fn: function(input, length) {
			return (this.is_letters(input) && (input.length && input.length <= length));
		},
		text: 'cannot be longer then {0} characters'
	},
	required: {
		fn: function(input) {
			return (input.length && input.length > 0);
		},
		text: 'this is a required field'
	},
	is_letters: {
		fn: function(input) {
			return this.regex.is_letters.test(input);
		},
		text: 'must be letters only'
	},
	is_number: {
		fn: function(input) {
			return regex.number.test(input);
		},
		text: 'must be numbers only'
	},
	email: {
		fn: function(input) {
			return regex.email.text(input);
		},
		text: 'must be in email format (eg \'example@email.com\')'
	}
};


