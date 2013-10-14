var config = require('../config'),
	person = require('../models/person'),
	date = require('../util/date'),
	schema = require('../forms/register/schema'),
	validation = require('../util/validation'),
	_ = require('underscore'),
	format = require('util').format;

var scripts = ['/public/js/build/register.build.js'];

exports.is_form_valid = function (schema, post) {
	if (!post.camper_type) {
		return false;
	}

	return _.every(schema, function (section) {
		return _.every(section.fields, function (field) {
			return exports.validate_field(field, post);
		});
	});
};

exports.validate_field = function (field, post) {
	// no validation required
	if (!field.validation) {
		return true;
	}
	var required = field.validation.required;
	var value = post[field.name];

	// 1. if required: run checks
	// 2. if not required but there is a value: run checks
	if (required || (!required && value)) {

		// only run the check if the field is available to the camper_type
		if (!field.available_to || _.contains(field.available_to, post.camper_type)) {
			return exports.validate_item(field, value);
		}
	}

	return true;
};

exports.validate_item = function (field, post_value) {
	// rules
	return _.every(field.validation, function (value, key) {
		return validation[key].fn(post_value, value);
	});
};

exports.calculate_total = function (camper_type_name) {
	// not trusting client side for total
	// total = camp_fee - discounts + donation
	var total = config.application.camper_types[camper_type_name].fee;

	_.each(config.application.discounts, function (discount) {
		if (_.contains(discount.available_to, camper_type_name)) {
			return 'TODO';
		}
	});

};

exports.render_landing = function (req, res, next, validation_error) {
	person.find({}, function (err, people) {
		if (err) {
			next(new Error(err));
			return;
		}

		res.render('register', {
			title: 'Register',
			config: config.application,
			scripts: scripts,
			validation_error: validation_error,
			data: date.get_page_data(),
			people: people,
			schema: schema.populate()
		});

	}, null, {firstname: 1, lastname: 1});
};

exports.routes = function (app) {
	app.get('/register', function (req, res, next) {
		exports.render_landing(req, res, next);
	});

	app.post('/register', function (req, res, next) {
		console.log(format('post data: %j', req.body));

		var post = req.body;

		// validate form
		var valid = exports.is_form_valid(post, schema.populate());
		if (!valid) {
			return exports.render_landing(req, res, next, true);
		}

		var total = exports.calculate_total(post.camper_type);

		if (post.payment_method === 'Paypal') {
			// go to paypal
			console.warn('IMPLEMENT PAYPAL');
		} else {
			// TODO: SAVE REGISTRATION INTO DB

			res.render('register_confirmation', {
				total: total,
				method: post.payment_method,
				reference: 'TODO'
			});
		}

	});
};

