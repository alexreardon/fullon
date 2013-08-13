var email = require('../util/email'),
	sinon = require('sinon'),
	fs = require('fs'),
	path = require('path'),
	expect = require('expect.js');

describe('Email', function(){

	var stub,
		file_path = '../views/email/',
		file_name = 'test',
		file_contents = 'h1=text',
		template_data = {text: 'helloworld'},
		p = path.join(__dirname, file_path, file_name + '.jade');

	before(function(){
		fs.writeFileSync(p, file_contents);
	});

	after(function(){
		fs.unlinkSync(p);
	});

	beforeEach(function(){

		stub = sinon.stub(email, '_transport', function(data, cb){
			cb(null, 'success');
		});
	});

	afterEach(function(){
		stub.restore();
	});

	it('should prepare emails with correct attributes', function(done){

		var to = 'alexreardon@gmail.com',
			subject = 'My First Email';

		email._prepare(to, subject, file_name, template_data, function(err, data){

			expect(err).to.not.be.ok();

			expect(data).to.have.property('to', to);
			expect(data).to.have.property('subject', subject);
			expect(data).to.have.property('html', '<h1>' + template_data.text + '</h1>');
			done();
		});




	});


	it('should render templates and send an email', function(done){

		email.send('alexreardon@gmail.com', 'subject', file_name, null, function(err, response){
			expect(stub.calledOnce).to.be(true);
			done();
		});

	});

	//warning: will actually send an email
	it.only('should actually send an email', function(done){
		stub.restore();
		this.timeout(30000); //30s

		email.send('alexreardon@gmail.com', 'Test email', file_name, {text: 'Hello Alex. I\'m watching you'}, function(err, response){
			expect(err).to.not.be.ok();
			expect(response).to.be.ok();
			done();
		});
	});




});