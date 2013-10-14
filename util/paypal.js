//var PayPalEC = require('paypal-ec'),
//	config = require('../config');
//
//var cred = {
//	username: 'seller_1339472528_biz_api1.gmail.com',
//	password: '1339472553',
//	signature: 'AFcWxV21C7fd0v3bYYYRCpSSRl31Af-aECo8vsiP1HospgIyBCFncbx3'
//};
//
//var opts = {
//
//};
//
//var paypal = new PayPalEC(cred, opts);
//
//exports.make_payment = function (resp, amount, return_url, cancel_url, error_url, email, order_number) {
//
//	// https://cms.paypal.com/uk/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_SetExpressCheckout
//	var params = {
//		returnUrl: return_url,
//		cancelUrl: cancel_url,
//		SOLUTIONTYPE: 'sole',
//		EMAIL: email || '',
//		PAYMENTREQUEST_0_AMT: amount,
//		PAYMENTREQUEST_0_DESC: 'Full On 2014',
//		PAYMENTREQUEST_n_INVNUM: order_number,
//		NOSHIPPING: '1',
//		PAYMENTREQUEST_0_CURRENCYCODE: config.application.paypal.currency_code,
//		PAYMENTREQUEST_0_PAYMENTACTION: 'Sale'
//	};
//
//	paypal.set(params, function(err, data){
//		if(err){
//			return resp.redirect(error_url);
//		}
//		return resp.redirect(data.PAYMENTURL);
//	});
//
//};
//
