var config = require('../../config'),
	format = require('util').format,
	_ = require('underscore'),
	date = require('../../util/date');

var data = {
	allegiance: {
		name: 'allegiance',
		text: 'Allegiance',
		short_title: 'type',
		fields: {
			camper_type: {
				name: 'camper_type',
				text: 'Camper type',
				type: 'radio',
				hidden: true,
				options: [
					{ text: 'junior', value: 'junior'},
					{ text: 'senior', value: 'senior'},
					{ text: 'leader', value: 'leader'}
				],
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
		short_title: 'costs',
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
		short_title: 'basic',
		fields: {
			first_name: {
				text: 'First name',
				name: 'first_name',
				type: 'text',
				validation: {
					required: true,
					is_letters: true
				}
			},
			last_name: {
				text: 'Last name',
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
				options: [
					{ text: 'female', value: 'female'},
					{ text: 'male', value: 'male'}
				],
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
			address_street: {
				text: 'Street',
				name: 'address_street',
				type: 'text',
				validation: {
					required: true
				}
			},
			address_city: {
				text: 'City',
				name: 'address_city',
				type: 'text',
				validation: {
					required: true,
					is_letters: true
				}
			},
			address_postcode: {
				text: 'Postcode',
				name: 'address_postcode',
				type: 'text',
				validation: {
					required: true,
					is_numbers: true,
					min_length: 4,
					max_length: 4
				}
			}
		}

	},

	medical_organisations: {
		name: 'medical_organisations',
		text: 'Medical Organisations',
		short_title: 'contacts',
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
				type: 'text'
			},
			family_doctor: {
				text: 'Who is the family doctor?',
				name: 'family_doctor',
				type: 'text',
				validation: {
					is_letters: true
				}
			},
			doctor_phone: {
				text: 'Family doctor\'s phone number',
				name: 'doctor_phone',
				type: 'text',
				validation: {
					is_numbers: true,
					min_length: 8
				}
			}
		}
	},

	medical_emergency_contacts: {
		name: 'medical_emergency_contacts',
		text: 'Emergency Contacts',
		short_title: 'emergency',
		fields: (function () {

			var result = {};

			for (var i = 1; i <= 2; i++) {
				var required = (i === 1 ? true : false);

				result['emergency_contact_name_' + i] = {
					name: 'emergency_contact_name_' + i,
					text: 'Emergency Contact #' + i,
					type: 'text',
					validation: {
						required: required,
						is_letters: true
					}
				};

				result['emergency_contact_relationship_' + i] = {
					name: 'emergency_contact_relationship_' + i,
					text: 'What is their relationship to the camper?',
					info: 'For example \'parent\', \'close family friend\' and so on',
					type: 'text',
					validation: {
						required: required,
						is_letters: true
					}
				};

				result['emergency_contact_phone_' + i] = {
					name: 'emergency_contact_phone_' + i,
					text: 'What is their best contact number?',
					type: 'text',
					validation: {
						required: required,
						is_numbers: true
					}
				};
			}

			return result;

		})()
	},

	medical_info: {
		name: 'medical_info',
		text: 'Personal Medical Information',
		short_title: 'medical',
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
				options: [
					{ text: 'yes', value: 'yes'},
					{ text: 'no', value: 'no'}
				],
				_default: 'no',
				validation: {
					required: true
				}
			},
			respiratory_conditions: {
				name: 'respiratory_conditions',
				text: 'Any respiratory conditions?',
				type: 'radio',
				options: [
					{ text: 'Asthsma', value: 'asthsma'},
					{ text: 'Other', value: 'other'},
					{ text: 'None', value: 'none'}
				],
				_default: 'none',
				validation: {
					required: true
				}
			},
			allergies: {
				name: 'allergies',
				text: 'Any allergies?',
				type: 'checkbox',
				options: [
					{ text: 'Food', value: 'food'},
					{ text: 'Drugs', value: 'drugs'},
					{ text: 'Environment', value: 'environment'},
					{ text: 'Other', value: 'other'},
					{ text: 'None', value: 'none'},

				],
				_default: 'none',
				validation: {
					required: true
				}
			},
			muscular_skeletal_problems: {
				name: 'muscular_skeletal_problems',
				text: 'Any muscular / skeletal problems?',
				type: 'checkbox',
				options: [
					{ text: 'Back issues', value: 'back_issues'},
					{ text: 'Sprains, dislocations', value: 'sprains_dislocations'},
					{ text: 'Other', value: 'other'},
					{ text: 'None', value: 'none'},

				],
				_default: 'none',
				validation: {
					required: true
				}
			},
			epilepsy: {
				name: 'epilepsy',
				text: 'Epilepsy?',
				type: 'radio',
				options: [
					{ text: 'yes', value: 'yes'},
					{ text: 'no', value: 'no'}
				],
				_default: 'no',
				validation: {
					required: true
				}
			},
			headaches_nosebleeds: {
				name: 'headaches_nosebleeds',
				text: 'Any headaches or nose bleeds?',
				type: 'radio',
				options: [
					{ text: 'yes', value: 'yes'},
					{ text: 'no', value: 'no'}
				],
				_default: 'no',
				validation: {
					required: true
				}
			},
			medical_other: {
				name: 'medical_other',
				text: 'Any other medical conditions we should be aware of?',
				type: 'radio',
				options: [
					{ text: 'yes', value: 'yes'},
					{ text: 'no', value: 'no'}
				],
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
		short_title: 'activities',
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
				options: [
					{ text: 'Strong (swim 50m+ unaided)', value: 'strong' },
					{ text: 'Average (swim 25m unaided)', value: 'average' },
					{ text: 'Poor (swim 10m unaided)', value: 'poor' },
					{ text: 'Can\'t swim (cannot swim unaided)', value: 'cant' },

				],
				validation: {
					required: 'true'
				}
			},
			movie_access: {
				name: 'movie_access',
				text: 'What is the highest movie rating the camper is permitted to watch?',
				type: 'radio',
				options: [
					{ text: 'G', value: 'G' },
					{ text: 'PG', value: 'PG' },
					{ text: 'M', value: 'M' },
					{ text: 'MA', value: 'MA' },

				],
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
		short_title: 'payment',
		fields: {
			is_payer_registering: {
				name: 'is_payer_registering',
				text: 'Is the person paying the same person who is going on camp?',
				info: 'If you are filling out this form for your child select \'no\'',
				type: 'radio',
				options: [
					{ text: 'yes', value: 'yes'},
					{ text: 'no', value: 'no'}
				],
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
				options: [
					{ text: 'yes', value: 'yes'},
					{ text: 'no', value: 'no'}
				],
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
				options: (function () {
					var result = [];
					_.each(config.application.payment_types, function (type) {
						result.push({ value: type.name, text: type.text });
					});

					return result;
				})(),
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
		options: [
			{ text: 'yes', value: 'yes'},
			{ text: 'no', value: 'no'}
		],
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

function populate () {
	var copy = JSON.parse(JSON.stringify(data));

	// populate discount fields
	copy.costs.fields.discount_chocolate = populate_discount_field('chocolate');
	copy.costs.fields.discount_earlybird = populate_discount_field('earlybird',
		(date.get_days_until(config.application.date_earlybird_end) >= 0 ? 'yes' : 'no'), true);
	copy.costs.fields.discount_sibling = populate_discount_field('sibling', 'no');
	copy.costs.fields.discount_married = populate_discount_field('married', 'no');

	return copy;
}

exports.populate = populate;