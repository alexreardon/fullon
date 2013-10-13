var config = require('../../config'),
	format = require('util').format,
	_ = require('underscore'),
	date = require('../../util/date');

var schema = {
	allegiance: {
		name: 'allegiance',
		text: 'Allegiance',
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

	// DO NOT DELETE PLACEHOLDER
	costs: {
		name: 'costs',
		text: 'Costs',
		fields: {
			donation: {
				name: 'donation',
				text: 'Would you like to make an optional donation for other campers?',
				type: 'money',
				info: 'This will go towards subsiding camp fees for those who could not otherwise afford to attend. For more information see <a href="/#about" target="_blank">about</a>',
				_default: '0',
				validation: {
					is_money: true
				}
			}
		}
	},

	basic: {
		name: 'basic',
		text: 'Basic Information',
		fields: {
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
				name: 'last_name',
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
					is_numbers: true,
					min_length: 8
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
		}

	},

	medical_contacts: {
		name: 'medical_contacts',
		text: 'Medical Contacts',
		fields: {
			medicare_number: {
				text: 'Medicare number',
				name: 'medicare_number',
				type: 'text',
				validation: {
					is_numbers: true
				}
			},
			medicare_ref: {
				text: 'Medicare reference number',
				name: 'medicare_ref',
				type: 'text',
				validation: {
					is_numbers: true
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
					is_numbers: true,
					min_length: 8
				}
			}
		}
	},

	medical_info: {
		name: 'medical_info',
		text: 'Personal Medical Information',
		fields: {
			tetanus_date: {
				name: 'tetanus_date',
				text: 'Date of last Tetanus Booster',
				type: 'date',
				validation: {
					required: true,
					is_date: true
				}
			},
			special_dietary_needs: {
				name: 'special_dietary_needs',
				text: 'Special dietary needs?',
				type: 'textarea'
			},
			heart_problems: {
				name: 'heart_problems',
				text: 'Any heart problems?',
				type: 'radio',
				options: ['yes', 'no'],
				_default: 'no',
				validation: {
					required: true
				}
			},
			respiratory_conditions: {
				name: 'respiratory_conditions',
				text: 'Any respiratory conditions?',
				type: 'radio',
				options: ['Asthsma', 'Other', 'None'],
				_default: 'None',
				validation: {
					required: true
				}
			},
			allergies: {
				name: 'allergies',
				text: 'Any allergies?',
				type: 'checkbox',
				options: ['Food', 'Drugs', 'Environment', 'Other', 'None'],
				_default: 'None',
				validation: {
					required: true
				}
			},
			muscular_skeletal_problems: {
				name: 'muscular_skeletal_problems',
				text: 'Any muscular / skeletal problems?',
				type: 'checkbox',
				options: ['Back issues', 'Sprains, dislocations', 'Other', 'None'],
				_default: 'None',
				validation: {
					required: true
				}
			},
			epilepsy: {
				name: 'epilepsy',
				text: 'Epilepsy?',
				type: 'radio',
				options: ['yes', 'no'],
				_default: 'no',
				validation: {
					required: true
				}
			},
			headaches_nosebleeds: {
				name: 'headaches_nosebleeds',
				text: 'Any headaches or nose bleeds?',
				type: 'radio',
				options: ['yes', 'no'],
				_default: 'no',
				validation: {
					required: true
				}
			},
			medical_other: {
				name: 'medical_other',
				text: 'Any other medical conditions we should be aware of?',
				type: 'radio',
				options: ['yes', 'no'],
				_default: 'no',
				validation: {
					required: true
				}
			},
			treatment_details: {
				name: 'treatment_details',
				text: 'Please provide details of conditions',
				type: 'textarea',
				info: 'Provide unlisted conditions, treatment, medication, treatment, triggers and so on.'
			}
		}

	},

	activities: {
		name: 'activities',
		text: 'Activities',
		info: 'TEST 123 ',
		fields: {
			activity_restrictions: {
				name: 'activity_restrictions',
				text: 'Is the participant restricted from any activities?',
				type: 'textarea'
			},
			swimming_ability: {
				name: 'swimming_ability',
				text: 'Please estimate swimming ability',
				type: 'radio',
				options: ['Strong (swim 50m+ unaided)', 'Average (swim 25m unaided)', 'Poor (swim 10m unaided)', 'Can\'t swim (cannot swim unaided)'],
				validation: {
					required: 'true'
				}
			},
			movie_access: {
				name: 'movie_access',
				text: 'What is the highest movie rating the camper is permitted to watch?',
				type: 'radio',
				options: ['G', 'PG', 'M', 'MA'],
				available_to: ['junior', 'senior'],
				validation: {
					required: true
				}
			},
			details_other: {
				name: 'details_other',
				text: 'Any other relevant non-medical information?',
				type: 'textarea'
			}
		}


	},

	payment: {
		name: 'payment',
		text: 'Payment',
		fields: {
			is_payer_registering: {
				name: 'is_payer_registering',
				text: 'Is the person paying the same person who is going on camp?',
				info: 'If you are filling out this form for your child select \'no\'',
				type: 'radio',
				options: ['yes', 'no'],
				_default: 'no',
				validation: {
					required: true
				}
			},
			payer_first_name: {
				name: 'payer_first_name',
				text: 'Payer\'s first name',
				type: 'text',
				validation: {
					required: true,
					is_letters: true
				}
			},
			payer_last_name: {
				name: 'payer_last_name',
				text: 'Payer\'s last name',
				type: 'text',
				validation: {
					required: true,
					is_letters: true
				}
			},
			payer_email: {
				name: 'payer_email',
				text: 'Payer\'s email',
				type: 'text',
				validation: {
					required: true,
					is_email: true
				}
			},
			accept_indemnity: {
				name: 'accept_indemnity',
				text: 'Do you accept the above indemnity statement?',
				type: 'radio',
				options: ['yes', 'no'],
				_default: 'no',
				validation: {
					required: true,
					value: 'yes'
				}
			},
			payment_method: {
				name: 'payment_method',
				text: 'Select your payment method',
				info: 'For more information about these choices see our <a href="/#about" target="_blank">about page</a>',
				type: 'radio',
				options: ['Paypal', 'Bank desposit', 'Request assistance'],
				validation: {
					required: true
				}
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
	if (disabled) {
		field.disabled = true;
	}

	return field;
}

// populate discount fields
schema.costs.fields.discount_chocolate = populate_discount_field('chocolate');
schema.costs.fields.discount_earlybird = populate_discount_field('earlybird',
	(date.get_days_until(config.application.date_earlybird_end) >= 0 ? 'yes' : 'no'), true);
schema.costs.fields.discount_sibling = populate_discount_field('sibling', 'no');
schema.costs.fields.discount_married = populate_discount_field('married', 'no');

module.exports = schema;

