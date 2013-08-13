var nodemailer = require('nodemailer'),
	config = require('../config'),
	jade = require('jade'),
	fs = require('fs'),
	path = require('path'),
	format = require('util').format;

var smtpTransport = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: {
		user: config.google_username,
		pass: config.google_password
	}
});

//function that starts the network operation to send the email
exports._transport = function(options, cb) {
	smtpTransport.sendMail(options, function(err, response) {
		console.log(format('tried to send email [to: "%s" subject: "%s"]', options.to, options.subject));

		if(err){
			console.error('failed: ' + err);
		} else {
			console.log('success');
		}


		cb(err, response);
	});
}

exports._prepare = function(to, subject, template_name, template_data, cb) {
	var p = path.join(__dirname, '../views/email/', template_name + '.jade');

	fs.readFile(p, function(err, data){
		if(err){
			cb(format('error loading file "%s" [%j]',p , err));
			return;
		}

		var fn = jade.compile(data);

		cb(null, {

			to: to,
			subject: subject,
			from: format('Full On <%s>', config.google_username),
			html: fn(template_data || {})
		});

	});

//	jade.renderFile(p, { locals: template_data || {}}, function(err, html) {
//		if(err) {
//			cb(format('Error loading email template "%s" [%j]', p, err));
//			return;
//		}
//
//		cb(null, {
//			to: to,
//			subject: subject,
//			from: format('Full On <%s>', config.google_username),
//			html: html
//		});
//
//
//	});
}


//starts an async call - does not wait for success/failure
exports.send = function(to, subject, template_name, template_data, cb) {

	exports._prepare(to, subject, template_name, template_data, function(err, data) {
		if(err) {
			cb(err);
			return;
		}

		exports._transport(data, cb);
	});

};