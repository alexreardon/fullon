var config = require('../../config'),
	format = require('util').format,
	_ = require('underscore'),
	date = require('../../util/date');

var schema = {
	allegiance: {
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
	},

	// DO NOT DELETE PLACEHOLDER
	costs: {
//		discount_chocolate: {
//			name: 'chocolate',
//			text: (function () {
//				return config.application.discounts.chocolate.question;
//			})(),
//			type: 'radio',
//			options: ['yes', 'no'],
//			available_to: (function () {
//				return config.application.discounts.chocolate.available_to;
//			})(),
//			validation: {
//				required: true
//			}
//		},
////		discount_chocolate_amount: {
////			type: 'dynamic
////
////		},
//		discount_earlybird: {
//			name: 'earlybird',
//			text: (function () {
//				return config.application.discounts.earlybird.question;
//			})(),
//			info: config.application.discounts.earlybird.question,
//			disabled: true,
//			type: 'radio',
//			options: ['yes', 'no'],
//			_default: (date.get_days_until(config.application.date_earlybird_end) >= 0 ? 'yes' : 'no'),
//			validation: {
//				required: true
//			}
//		},
//		discount_sibling: {
//			name: 'sibling',
//			text: (function () {
//				return config.application.discounts.sibling.question;
//			})(),
//			info: 'This discount has changed since last year. It is now applied to every camper rather than subsequent campers.',
//			type: 'radio',
//			options: ['yes', 'no'],
//			_default: 'no',
//			validation: {
//				required: true
//			},
//			available_to: ['senior', 'junior']
//		},
//		discount_married: {
//			name: 'married',
//			text: (function () {
//				return config.application.discounts.married.question;
//			})(),
//			type: 'radio',
//			options: ['yes', 'no'],
//			_default: 'no',
//			validation: {
//				required: true
//			},
//			available_to: ['leader']
//		}
	},

	basic: {
		first_name: {
			text: 'first name',
			name: 'first_name',
			type: 'text',
			validation: {
				required: true,
				is_letters: true
			}
		},
		last_name: {
			text: 'last name',
			name: 'first_name',
			type: 'text',
			validation: {
				required: true,
				is_letters: true
			}
		},
		gender: {
			name: 'gender',
			text: 'Gender',
			type: 'radio',
			options: ['female', 'male'],
			validation: {
				required: true
			}

		},
		date_of_birth: {
			name: 'date_of_birth',
			text: 'Date of birth',
			type: 'date',
			validation: {
				required: true,
				is_date: true
			}

		},
		school_year: {
			name: 'school_year',
			text: 'School year',
			type: 'select',
			options: (function () {
				var result = [];
				var years = config.application.camper_types.junior.years.concat(config.application.camper_types.senior.years);
				_.each(years, function (year) {
					result.push({ value: year, text: year});
				});

				return result;
			})(),
			validation: {
				required: true
			},
			available_to: ['senior', 'junior']
		},
		contact_number: {
			text: 'Contact number',
			name: 'contact_number',
			type: 'text',
			validation: {
				required: true,
				is_numbers: true
			}
		},
		address: {
			text: 'Address',
			name: 'address',
			type: 'address',
			validation: {
				required: true
			}
		},
		email: {
			text: 'Email',
			name: 'email',
			type: 'text',
			validation: {
				required: true,
				is_email: true
			}
		}
	},

	medical_contacts: {
		medicare_number: {
			text: 'Medicare number',
			name: 'medicare_number',
			type: 'text',
			validation: {
				is_number: true
			}
		},
		medicare_ref: {
			text: 'Medicare reference number',
			name: 'medicare_ref',
			type: 'text',
			validation: {
				is_number: true
			}
		},
		medicare_expiry_date: {
			text: 'Medicare card expiry date',
			name: 'medicare_expiry_date',
			type: 'date',
			validation: {
				is_date: true
			}
		},
		private_health_insurance_company: {
			text: 'Private health insurance company',
			name: 'private_health_insurance_company',
			type: 'text',
			validation: {
				is_letters: true
			}
		},
		private_health_insurance_company_number: {
			text: 'Private health insurance membership number',
			name: 'private_health_insurance_company_number',
			type: 'text',
			validation: {
				is_numbers: true
			}
		},
		family_doctor: {
			text: 'Private health insurance membership number',
			name: 'private_health_insurance_company_number',
			type: 'text',
			validation: {
				is_numbers: true
			}
		},
		doctor_phone: {
			text: 'Doctor\'s phone number',
			name: 'doctor_phone',
			type: 'text',
			validation: {
				is_numbers: true
			}
		}

	}
};

function populate_discount_field (name, _default, disabled) {

	var field = {
		name: name,
		text: (function () {
			return config.application.discounts[name].question;
		})(),
		type: 'radio',
		options: ['yes', 'no'],
		available_to: (function () {
			return config.application.discounts[name].available_to;
		})(),
		validation: {
			required: true
		}
	};

	if (_default) {
		field._default = _default;
	}
	if(disabled){
		field.disabled = true;
	}

	return field;
}

// populate discount fields
schema.costs.discount_chocolate = populate_discount_field('chocolate');
schema.costs.discount_earlybird = populate_discount_field('earlybird',
	(date.get_days_until(config.application.date_earlybird_end) >= 0 ? 'yes' : 'no'), true);
schema.costs.discount_sibling = populate_discount_field('sibling', 'no');
schema.costs.discount_married = populate_discount_field('married', 'no');

module.exports = schema;

