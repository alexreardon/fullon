var nodemailer = require('nodemailer'),
	config = require('../config'),
	handlebars = require('handlebars'),
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
};

exports._prepare = function(to, subject, template_name, template_data, cb) {
	var p = path.join(__dirname, '../views/email/', template_name + '.handlebars');

	fs.readFile(p, function(err, data){
		if(err){
			cb(format('error loading file "%s" [%j]',p , err));
			return;
		}

		var template = handlebars.compile(data.toString());


		cb(null, {

			to: to,
			subject: subject,
			from: format('Full On <%s>', config.google_username),
			html: template(template_data || {})
		});

	});
};


//starts an async call - does not wait for success/failure
exports.send = function(to, subject, template_name, template_data, cb) {

	//put on the end of the event queue
	process.nextTick(function(){


		//if no callback - just do nothing with it
		if(!cb){
			cb = function(){};
		}

		exports._prepare(to, subject, template_name, template_data, function(err, data) {
			if(err) {
				console.error(err);
				cb(err);
				return;
			}

			exports._transport(data, cb);
		});
	});

};