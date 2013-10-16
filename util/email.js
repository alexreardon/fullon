var nodemailer = require('nodemailer'),
	config = require('../config'),
	handlebars = require('handlebars'),
	fs = require('fs'),
	path = require('path'),
	format = require('util').format,
	templates = require('./templates').email;

var smtpTransport = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: {
		user: config.google_username,
		pass: config.google_password
	}
});

//starts an async call - does not wait for success/failure
exports.send = function (to, subject, template_name, template_data, cb) {

	if(!templates[template_name]){
		console.error('email template not found: ' + template_name);
		if(cb){
			cb('email template not found: ' + template_name);
		}
		return;
	}
	//put on the end of the event queue
	process.nextTick(function () {
		var options = {
			to: to,
			subject: subject,
			from: format('Full On <%s>', config.google_username),
			html: templates[template_name](template_data || {}),
			cb: cb
		};

		smtpTransport.sendMail(options, function (err, response) {
			console.log(format('sending email [to: "%s" subject: "%s"]', options.to, options.subject));

			if (err) {
				console.error('failed: ' + err);
			} else {
				console.log('success');
			}

			if (cb) {
				cb(err, response);
			}
		});
	});

};