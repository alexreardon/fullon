var PaypalExpress = require('paypal-express').PaypalExpress,
	config = require('../config');

var paypal = new PaypalExpress(config.paypal.username, config.paypal.password, config.paypal.signature);
paypal.useSandbox(config.paypal.sandbox_mode);

exports.make_payment = function (amount, return_url, cancel_url, email) {

	paypal.beginInstantPayment({
		'RETURNURL': return_url,
		'CANCELURL': cancel_url,
		'EMAIL': email || '',
		'PAYMENTREQUEST_0_AMT': amount
		//More request parameters
	}, function(err, data) {
		if (err) {
			console.error(err);
		}

		if (data) {
			var token = data.token;
			var payment_url = data.payment_url;

			//Redirect to payment_url
		}
	});
};

