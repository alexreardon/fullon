var config = require('../config'),
	person = require('../models/person'),
	date = require('../util/date'),
	schema = require('../forms/register/schema'),
	validation = require('../util/validation'),
	_ = require('underscore'),
	format = require('util').format;

var scripts = ['/public/js/build/register.build.js'];

exports.get_invalid_fields = function (schema, post) {
	var failed_fields = [];

	if (!post.camper_type) {
		failed_fields.push({field: schema.allegiance.camper_type, post: 'camper_type'});
	}

	_.each(schema, function (section) {
		return _.each(section.fields, function (field) {
			var success = exports.validate_field(field, post);
			if (!success) {
				failed_fields.push({field: field, post: post[field.name]});
			}
		});
	});

	return failed_fields;
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
	if (required || (!required && value && value !== '')) {

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

exports.calculate_total = function (camper_type_name, post) {
	// not trusting client side for total
	// total = camp_fee - discounts + donation
	var total = config.application.camper_types[camper_type_name].fee;

	// discounts
	_.each(config.application.discounts, function (discount, key) {
		if (_.contains(discount.available_to, camper_type_name)) {
			if (!post[key]) {
				return true;
			}
			if (post[key] === 'yes') {
				if (key === 'chocolate' && post.chocolate_box_amount) {
					total -= (parseFloat(post.chocolate_box_amount) * config.application.discounts[key].amount);
				} else {
					total -= config.application.discounts[key].amount;
				}
			}
		}
	});

	// donation
	if (post.donation) {
		total += parseFloat(post.donation);
	}

	console.log('total:', total);
	return total;

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
		var invalid_fields = exports.get_invalid_fields(schema.populate(), post);
		if (invalid_fields.length) {
			console.warn('error validating form');
			console.warn(invalid_fields);
			return exports.render_landing(req, res, next, true);
		}

		console.log(format('successful post: %j', post));

		var total = exports.calculate_total(post.camper_type, post);

		post.payment_total = total;

		if (post.payment_method === config.application.payment_types.paypal.name) {
			// go to paypal
			console.warn('IMPLEMENT PAYPAL');
		} else {
			// TODO: SAVE REGISTRATION INTO DB
			// TODO: send confirmation email
			var message = {
				first_name: post.payer_first_name,
				last_name: post.payer_first_name,
				total: total,
				reference: '123231',
				payment_method: post.payment_method
			};

			req.session.registration_confirmation_details = message;
			res.redirect('/register/confirmation');
		}

	});

	app.get('/register/confirmation', function (req, res, next) {
//		if(!req.session.registration_confirmation_details){
//			return res.redirect('/register');
//		}
//
//		res.render('register_confirmation', req.session.registration_confirmation_details);

		var message = {
			first_name: 'Alex',
			last_name: 'Reardon',
			total: 100,
			reference: '123231',
			payment_method: 'Hello'
		};

		var data = {
			config: config.application,
			message: message
		};

		res.render('register_confirmation', data);


	});
};

