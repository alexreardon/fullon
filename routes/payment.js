var PayPalEC = require('paypal-ec'),
	_ = require('underscore'),
	config = require('../config');

var cred = {
	username: config.paypal.username,
	password: config.paypal.password,
	signature: config.paypal.signature
};

var opts = {
	sandbox: config.paypal.sandbox_mode,
	version: '102.0' //'78.0'
};

var paypal = new PayPalEC(cred, opts);

exports.make_payment = function (options) {
	//options:
//	var options: {
//		res: res,
//		next: next,
//		req: req,
//		total: total,
//		email: post.email,
//		success_url: '/register/paypalsuccess'
//	}

	var params = {
		returnUrl: config.root_url + '/payment/confirm',
		cancelUrl: config.root_url + '/payment/cancel',
		EMAIL: options.email || '',
		NOSHIPPING: '1',
		ALLOWNOTE: 0,
		SOLUTIONTYPE: 'sole',
		PAYMENTREQUEST_0_AMT: options.total,
		PAYMENTREQUEST_0_CURRENCYCODE: config.paypal.currency_code,
		PAYMENTREQUEST_0_PAYMENTACTION: 'Sale',
		L_PAYMENTREQUEST_0_INVNUM0: options.reference,
		L_PAYMENTREQUEST_0_NAME0: 'Full On 2014',
		L_PAYMENTREQUEST_0_QTY0: 1,
		L_PAYMENTREQUEST_0_AMT0: options.total
	};

	options.req.session.payment_params = _.extend(params, {
		successUrl: config.root_url + options.success_url
	});

	// http://stackoverflow.com/questions/8206175/missing-amount-and-order-summary-in-paypal-express-checkout
	// https://cms.paypal.com/uk/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_SetExpressCheckout
	paypal.set(params, function (err, data) {
		if (err) {
			console.warn('paypal connection error', err);
			return options.next(new Error('failed to make a connection with paypal'));
		}
		return options.res.redirect(data.PAYMENTURL);
	});
};

exports.routes = function (app) {
//	app.get('/payment/test', function (req, res, next) {
//
//		return exports.make_payment({
//			res: res,
//			req: req,
//			next: next,
//			total: 100,
//			email: 'alexreardon@gmail.com',
//			success_url: '/register/die'
//		});
//	});

	app.get('/payment/confirm', function (req, res, next) {

		req.session.payment_params.TOKEN = req.query.token;
		req.session.payment_params.PAYERID = req.query.PayerID;

		paypal.do_payment(req.session.payment_params, function (err, data) {
			if (err) {
				console.log('error completing payment', err);
				return next(err);
			}

			// update registration submission data
			if (req.session.pending_registration) {
				req.session.pending_registration.paypal_success = data.ACK;
				req.session.pending_registration.paypal_correlation_id = data.CORRELATIONID;
				req.session.pending_registration.paypal_transaction_id = data.PAYMENTINFO_0_TRANSACTIONID;
			}

			var redirect = req.session.payment_params.successUrl;
			req.session.payment_params = null;
			res.redirect(redirect);
		});
	});

	app.get('/payment/cancel', function (req, res, next) {
		next(new Error('Sorry. Your submission has been cancelled. You will need to fill out your registration form again'));
	});
};

