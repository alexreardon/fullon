var expect = require('expect.js'),
	register = require('../routes/register'),
	config = require('../config'),
	sinon = require('sinon'),
	_ = require('underscore');

describe('Register submission', function () {

	var schema = {

		allegiance: {
			name: 'allegiance',
			text: 'Allegiance',
			short_title: 'type',
			fields: {
				camper_type: {
					name: 'camper_type',
					type: 'radio',
					hidden: true,
					info: 'If you are a married leader please fill this form out twice, once for each person',
					options: ['junior', 'senior', 'leader'],
					validation: {
						required: true
					}
				}
			}

		},
		basic: {
			// multiple rules
			contact_number: {
				text: 'Contact number',
				name: 'contact_number',
				available_to: ['leader'],
				type: 'text',
				validation: {
					required: true,
					is_numbers: true,
					min_length: 8
				}
			},

			// no rules
			address_street: {
				text: 'Street',
				name: 'address_street',
				type: 'text'
			}
		}

	};

	describe('validate item', function () {

		it('should skip fields that dont have validation', function () {
			expect(register.validate_field(schema.basic.address_street, null)).to.be(true);
		});

		it('should allow legal values', function () {
			var data = '12345678';

			expect(register.validate_item(schema.basic.contact_number, data)).to.be(true);
		});

		it('should block illegal values', function () {
			var data = '123A';
			expect(register.validate_item(schema.basic.contact_number, data)).to.be(false);
		});

	});

	describe('validate field', function () {

		beforeEach(function () {
			sinon.stub(register, 'validate_item');
		});

		afterEach(function () {
			register.validate_item.restore();
		});

		it('should pass with no validation rules', function () {
			var field = {
				text: 'Street',
				name: 'address_street',
				type: 'text'
			};
			var data = {
				foo: 'bar'
			};

			expect(register.validate_field(field, data)).to.be(true);

		});

		it('should pass if no value passed and field is not required', function () {
			var field = {
				name: 'address_street',
				validation: {
					is_letters: true,
					min_length: 4
				}
			};
			var data = {};

			expect(register.validate_field(field, data)).to.be(true);
		});

		it('should run check if field is required and data is passed', function () {
			var field = {
				name: 'address_street',
				validation: {
					required: true
				}
			};
			var data = {
				address_street: 'fun lane'
			};

			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(true);
		});

		it('should run check if field is required and NO data is passed', function () {
			var field = {
				name: 'address_street',
				validation: {
					required: true
				}
			};
			var data = {};
			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(true);

		});

		it('should run check if not required but a value is passed', function () {
			var field = {
				name: 'address_street',
				validation: {
					min_length: 2
				}
			};

			var data = {
				address_street: 'fun lane'
			};

			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(true);
		});

		it('should run check if field is available to all', function () {
			var field = {
				name: 'address_street',
				validation: {
					min_length: 2
				}
			};

			var data = {
				address_street: 'fun lane'
			};

			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(true);
		});

		it('should run check if field available to camper_type', function () {
			var camper_type = 'leader',
				field = {
					name: 'address_street',
					available_to: [camper_type],
					validation: {
						min_length: 2
					}
				},
				data = {
					address_street: 'fun lane',
					camper_type: camper_type
				};

			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(true);
		});

		it('should not run check if field is not available to camper_type', function () {
			var camper_type = 'leader',
				field = {
					name: 'address_street',
					available_to: 'junior',
					validation: {
						min_length: 2
					}
				},
				data = {
					address_street: 'fun lane',
					camper_type: camper_type
				};

			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(false);
		});

		it('should not run check if field is not available to camper_type even if required', function () {
			var camper_type = 'leader',
				field = {
					name: 'address_street',
					available_to: 'junior',
					validation: {
						required: true,
						min_length: 2
					}
				},
				data = {
					address_street: 'fun lane',
					camper_type: camper_type
				};

			register.validate_field(field, data);
			expect(register.validate_item.calledOnce).to.be(false);
		});

	});

});
