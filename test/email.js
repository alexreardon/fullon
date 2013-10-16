var email = require('../util/email'),
	sinon = require('sinon'),
	fs = require('fs'),
	path = require('path'),
	expect = require('expect.js');

describe('Email', function(){

	var file_path = '../views/email/',
		file_name = 'test',
		file_contents = '<h1>{{text}}</h1>',
		template_data = {text: 'helloworld'},
		p = path.join(__dirname, file_path, file_name + '.hbs');

//	before(function(){
//		fs.writeFileSync(p, file_contents);
//	});
//
//	after(function(){
//		fs.unlinkSync(p);
//	});



	//warning: will actually send an email
	it.skip('should actually send an email', function(done){
		this.timeout(30000); //30s

		email.send('alexreardon@gmail.com', 'Test email', file_name, {text: 'Hello Alex. I\'m watching you'}, function(err, response){
			expect(err).to.not.be.ok();
			expect(response).to.be.ok();
			done();
		});
	});




});