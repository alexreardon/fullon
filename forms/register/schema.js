var schemaOld = {
	camper_type: {
		allegiance: {
			type: 'radio',
			info: 'If you are a married leader please fill this form out twice, once for each person',
			options: ['camper', 'leader'],
			validation: {
				required: true
			}
		}
	},
	discounts: {
		chocolate: {
			type: 'select',
			data: null
		},
		early_bird: {
			type: 'radio',
			data: null,
			options: ['yes', 'no'],
			validation: {
				required: true
			}
		},

		married: {
			text: 'are you married?',
			type: 'radio',
			options: ['yes', 'no'],
			conditions: {
				allegiance: 'leader'
			},
			validation: {
				required: true
			}
		}
	}
};

var config = require('../../config'),
	format = require('util').format,
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

	costs: {
		discount_chocolate: {
			name: 'chocolate',
			text: 'Did you sell any boxes of chocolates this year?',
			type: 'radio',
			options: ['yes', 'no'],
			validation: {
				required: true
			}
		},
//		discount_chocolate_amount: {
//			type: 'dynamic
//
//		},
		discount_earlybird: {
			name: 'earlybird',
			text: 'Early bird discount',
			info: config.application.discounts.earlybird.question,
			disabled: true,
			type: 'radio',
			options: ['yes', 'no'],
			_default: (date.get_days_until(config.application.date_earlybird_end) >= 0 ? 'yes' : 'no'),
			validation: {
				required: true
			}
		},
		discount_sibling: {
			name: 'sibling',
			text: 'Do you have any siblings going on Full On this year?',
			info: 'This discount has changed since last year. It is now applied to every camper rather than subsequent campers.',
			type: 'radio',
			options: ['yes', 'no'],
			_default: 'no',
			validation: {
				required: true
			},
			conditions: {
				camper_type: ['senior', 'junior']
			}
		},
		discount_married: {
			name: 'married',
			text: 'Are you married and is your spouse also going to full on?',
			type: 'radio',
			options: ['yes', 'no'],
			_default: 'no',
			validation: {
				required: true
			},
			conditions: {
				camper_type: ['leader']
			}
		}
	}
};

module.exports = schema;

