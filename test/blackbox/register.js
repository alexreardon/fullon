var expect = require('expect.js'),
	request = require('request'),
	format = require('util').format,
	config = require('../../config'),
	registration = require('../../models/registration'),
	app = require('../../app');

describe('Registration', function () {

	var port = 8080,
		server,
		valid_post_data = {'camper_type': 'junior', 'chocolate': 'yes', 'chocolate_box_amount': '1', 'earlybird': 'yes', 'sibling': 'no', 'married': 'no', 'donation': '0', 'first_name': 'TEST', 'last_name': 'Reardon', 'gender': 'male', 'date_of_birth': '14/10/2013', 'school_year': '6', 'contact_number': '12345678', 'address_street': 'test', 'address_city': 'test', 'address_postcode': '1234', 'medicare_number': '', 'medicare_ref': '', 'medicare_expiry_date': '', 'private_health_insurance_company': '', 'private_health_insurance_company_number': '', 'family_doctor': '', 'doctor_phone': '', 'emergency_contact_name_1': 'test', 'emergency_contact_relationship_1': 'parent', 'emergency_contact_phone_1': '12345678', 'emergency_contact_name_2': '', 'emergency_contact_relationship_2': '', 'emergency_contact_phone_2': '', 'tetanus_date': '08/10/2013', 'special_dietary_needs': '', 'heart_problems': 'no', 'respiratory_conditions': 'none', 'allergies': 'none', 'muscular_skeletal_problems': 'none', 'epilepsy': 'no', 'headaches_nosebleeds': 'no', 'medical_other': 'no', 'treatment_details': '', 'activity_restrictions': '', 'swimming_ability': 'strong', 'movie_access': 'G', 'details_other': '', 'is_payer_registering': 'yes', 'payer_first_name': 'Alex', 'payer_last_name': 'Reardon', 'payer_email': 'alexreardon@gmail.com', 'accept_indemnity': 'yes', 'payment_method': 'payment_other'};

	beforeEach(function (done) {
		server = app.listen(port, function () {
			console.log('app now listening on ' + port);
			done();
		});
	});

	afterEach(function () {
		server.close();
	});

	function get_path (url) {
		return format('%s:%s/%s', config.root_url, port, url);
	}

	function valid_post (cb) {
		request.post({
			url: get_path('register'),
			followAllRedirects: true,
			jar: true,
			form: valid_post_data
		}, cb);
	}

	it('should serve up the registration page', function (done) {
		request(get_path('register'), function (error, response, body) {
			expect(response.statusCode).to.be(200);
			done();
		});
	});

	it('should not accept posts with no data', function (done) {
		request.post({
			url: get_path('register'),
			followAllRedirects: true,
			form: {}
		}, function (err, response, body) {

			expect(response.request.redirects).to.have.length(0);
			done();
		});

	});

	it('should accept posts with valid data', function (done) {
		valid_post(function (err, response, body) {
			expect(response.request.redirects).to.have.length(1);
			expect(response.request.redirects[0].redirectUri).to.be(get_path('register/confirmation'));
			done();
		});

	});

	it('should create a database entry', function (done) {
		registration.find({}, function (err, regs) {
			var initial = regs.length;

			valid_post(function (err, response, body) {

				registration.find({}, function (err, new_regs) {
					var new_count = new_regs.length;

					expect(new_count).to.be(initial + 1);
					done();
				});
			});

		});
	});

});