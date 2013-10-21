var expect = require('expect.js'),
	request = require('request'),
	format = require('util').format,
	config = require('../../config'),
	app = require('../../app');

describe('Routes - General', function () {

	var port = 8080,
		server;

	beforeEach(function (done) {
		server = app.listen(port, function () {
			console.log('app now listening on ' + port);
			done();
		});
	});

	afterEach(function () {
		server.close();
	});

	function get_path (url) {
		return format('%s:%s/%s', config.root_url, port, url);
	}

	it('should serve the home page', function (done) {
		request(get_path(''), function (error, response, body) {
			expect(response.statusCode).to.be(200);
			done();
		});
	});

	it('should serve 404 pages', function (done) {
		request(get_path('/some/fake/route'), function (error, response, body) {
			expect(response.statusCode).to.be(404);
			done();
		});
	});

});