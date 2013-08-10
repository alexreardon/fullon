var nodemailer = require('nodemailer'),
	config = require('../config'),
	path = require('path'),
	jade = require('jade'),
	format = require('util').format;

var smtpTransport = nodemailer.createTransport('SMTP',{
	service: 'Gmail',
	auth: {
		user: config.google_username,
		pass: config.google_password
	}
});



//starts an async call - does not wait for success/failure
function send(to, subject, template_name, template_data){
	var data = {
		to: to,
		subject: subject,
		from: format('Full On <%s>', config.google_username),
		html: jade.renderFile(path.join('../views/email/', template_name), template_data)
	};


}

function _email(options){
	smtpTransport.sendMail(options, function(error, response){
		if(error){
			console.error(error);
		}else{
			console.log('Message sent: ' + response.message);
		}
	});
}



exports.send = send;
