var format = require('util').format,
	hbs = require('hbs'),
	config = require('../config'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

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

exports.ifEq = function (v1, v2, options) {
	if (v1 === v2) {
		console.log('IF EQL', arguments);
		return options.fn(this);
	}
	return options.inverse(this);
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

//exports.get_initial_discount = function(field){
//	if(field)
//};

function get_template (name) {
	var text = fs.readFileSync(path.join(__dirname, './helpers/', name + '.hbs'), 'utf8');
	return hbs.handlebars.compile(text);
}

var templates = {};

function init () {
	var list = ['radio', 'navigation_buttons'];

	_.each(list, function (item) {
		templates[item] = get_template(item);
	});
}

init();



exports.get_discount = function(options){
	var item = config.application.discounts[this.name];
	if(!item){
		throw new Error('config value not found', arguments);
	}
	return config.application.discounts[this.name].amount;
};

exports.navigation_buttons = function (schema, current_section) {
	var keys = Object.keys(schema);
	var current_index = keys.indexOf(current_section);

	var data = {
		back: current_index > 0 ? keys[current_index - 1] : false,
		next: current_index < (keys.length - 1) ? keys[current_index + 1] : false
	};

	return templates.navigation_buttons(data);

};

exports._print_field = function (field, data_value) {
	var template = templates[field.type];

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

exports.print_fields = function (section) {
//	var result = '';
//
//	_.each(schema[section_id], function (field) {
//		result += exports.print_field(schema, section_id, field.id);
//	});
//
//	return result;
};

