exports = {
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

		married : {
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

