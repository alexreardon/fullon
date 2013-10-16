var format = require('util').format,
	hbs = require('hbs'),
	config = require('../config'),
	fs = require('fs'),
	path = require('path'),
	validation = require('../util/validation'),
	_ = require('underscore'),

	templates = require('../util/templates').helpers,
	camper_types_array = Object.keys(config.application.camper_types);

// http://jsfiddle.net/mpetrovich/wMmHS/
exports.math = function (lvalue, operator, rvalue, options) {
	lvalue = parseFloat(lvalue);
	rvalue = parseFloat(rvalue);

	if (operator === '+') {
		return (lvalue + rvalue);
	}
	if (operator === '-') {
		return (lvalue - rvalue);
	}
	if (operator === '*') {
		return (lvalue * rvalue);
	}
	if (operator === '/') {
		return (lvalue / rvalue);
	}
	if (operator === '%') {
		return (lvalue % rvalue);
	}
};

exports.if_equal = function (v1, v2, options) {
	if (v1 === v2) {
		return options.fn(this);
	}
	return options.inverse(this);
};

exports.if_not_equal = function (v1, v2, options) {
	if (v1 !== v2) {
		return options.fn(this);
	}
	return options.inverse(this);
};

// https://gist.github.com/burin/1048968
exports.each_with_index = function (list, options) {
	var result = '';
	var i = 0;

	_.each(list, function (item) {
		item.index = i;
		result += options.fn(item);
		i++;
	});

	// return the finished buffer
	return result;

};

exports.print_array = function (array) {
	var result = '';
	for (var i = 0; i < array.length; i++) {
		result += array[i];
		if (i < array.length - 2) {
			result += ', ';
		} else if (i === array.length - 2) {
			result += ' & ';
		}
	}
	return result;
};

exports.print_json = function (item) {
	return JSON.stringify(item);
};

exports.get_camper_types = function (field) {
	if (!field.available_to) {
		field.available_to = camper_types_array;
	}

	return field.available_to.join('|');
};

exports.leaderboard = function (people) {

	var result = '',
		previous_position = 0,
		css = 'secondary';

	_.each(people, function (person) {

		if (person.temp.position !== previous_position) {
			previous_position = person.temp.position;

			css = (css === 'primary' ? 'secondary' : 'primary');

			result += format('<tr class="first_row %s">', css);
			result += format('<td class="position" rowspan="%s"><div class="fill">%s</div></td>', (person.temp.shared + 1), person.temp.position);

		} else {
			result += format('<tr class="%s">', css);
		}

		result += format('<td class="name">%s %s</td><td><div class="boxes_sold">%s</div></td></tr>', person.data.firstname, person.data.lastname, person.data.sold);
	});

	return new hbs.handlebars.SafeString(result);

};

exports.get_property_from_key = function (data, options) {
	return data[options.data.key];
};

exports.print_validation_rules = function (rules) {
	var temp = [];
	_.each(rules, function (value, key) {
		temp.push(format('%s:%s', key, value));
	});
	return temp.join('|');
};

exports.get_validation_messages = function (rules) {
	var result = '<ul>';

	_.each(rules, function (value, key) {
		if (!validation[key]) {
			console.warn('invalid validation requested', value, key);
			return;
		}

		result += format('<li>%s</li>', (validation[key].text.replace('{0}', value)));
	});

	result += '</ul>';
	return result;
};

exports.get_discount = function (options) {
	var item = config.application.discounts[this.name];
	if (!item) {
		throw new Error('config value not found', arguments);
	}
	return config.application.discounts[this.name].amount;
};

exports.submit_buttons = function () {
	return templates.navigation_buttons({
		submit: true
	});
};

exports.navigation_buttons = function () {
	return templates.navigation_buttons({
		submit: false
	});
};

exports._print_field = function (field, data_value) {
	var template = templates['input_' + field.type];

	if (!field || !template) {
		throw new Error(format('invalid print_field args [%j] [%j]', field, template));
	}

	return template(_.extend(field, {data_value: data_value}));
};

exports.print_field_with_data_attr = function (field, data_value) {
	return exports._print_field(field, data_value);
};

exports.print_field = function (field) {
	return exports._print_field(field);
};


