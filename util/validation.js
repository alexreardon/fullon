var regex = {
	email: /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
	number: /^\d+$/,
	letters: /^[a-zA-Z]+[a-zA-Z\s]*$/,
	date: /^[\d]{2}\/[\d]{2}\/[\d]{4}$/, // DD/MM/YYYY
	money: /^[\d,]+?$/ // 111,000,00
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
		text: 'date is expected the format: DD/MM/YYYY'
	},
	is_money: {
		fn: function(input) {
			return regex.money.test(input);
		},
		text: 'money is expected in the format: 10 or 10,000 or 10000 (no \'$\' or decimal points)'
	},
	value: {
		fn: function(input, value) {
			return (input === value);
		},
		text: 'value must be \'{0}\''
	}
};

// export for client and server side usage
module.exports = exports = rules;


