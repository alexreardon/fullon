var expect = require('expect.js'),
	sinon = require('sinon'),
	spreadsheet = require('../../jobs/spreadsheet'),
	config = require('../../config'),
	_ = require('underscore'),
	database = require('../../util/db'),
	person = require('../../models/person');

describe('Job - Get Spreadsheet Data', function () {

	describe('get_person', function () {

		var firstname = 'Bob',
			lastname = 'Smith',
			data = [
				{
					firstname: firstname,
					lastname: lastname,
					sold: 1,
					attributed: 1
				},
				{
					firstname: 'Jane',
					lastname: 'Smith',
					sold: 2,
					attributed: 2
				}
			],
			people;

		beforeEach(function () {
			people = [];
			_.each(data, function (item) {
				people.push(person.create({data: item}));
			});
		});

		it('should find a match', function () {
			var person = spreadsheet._get_person(people, firstname, lastname);
			expect(person).to.equal(people[0]);
		});

		it('should not create a new person when a match is found', function () {

			var person = spreadsheet._get_person(people, 'Bob', 'Smith');
			expect(people).to.have.length(data.length);
		});

		it('should create a new person when a match is not found', function () {

			var person = spreadsheet._get_person(people, firstname + 'newText', lastname + 'newText');
			expect(people).to.have.length(data.length + 1);
		});
	});

	describe('Process data', function () {

		var data = [
			{
				'_xml': '<entry><id>https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cokwr</id><updated>2013-07-27T07:47:35.325Z</updated><category scheme="http://schemas.google.com/spreadsheets/2006" term="http://schemas.google.com/spreadsheets/2006#list"/><title type="text">1</title><content type="text">sellerfirstname: Alex, sellerlastname: Reardon, datetaken: 19/7/2013</content><link rel="self" type="application/atom+xml" href="https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cokwr"/><link rel="edit" type="application/atom+xml" href="https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cokwr/37hlf6blh89ide"/><gsx:boxno>1</gsx:boxno><gsx:sellerfirstname>Alex</gsx:sellerfirstname><gsx:sellerlastname>Reardon</gsx:sellerlastname><gsx:datetaken>19/7/2013</gsx:datetaken><gsx:datereceived></gsx:datereceived><gsx:attributedfirstname></gsx:attributedfirstname><gsx:attributedlastname></gsx:attributedlastname></entry>',
				'id': 'https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cokwr',
				'title': '1',
				'content': 'sellerfirstname: Alex, sellerlastname: Reardon, datetaken: 19/7/2013',
				'_links': [],
				'boxno': '1',
				'sellerfirstname': 'Alex',
				'sellerlastname': 'Reardon',
				'datetaken': '19/7/2013',
				'datereceived': '19/7/2013',
				'attributedfirstname': '',
				'attributedlastname': ''
			},
			{
				'_xml': '<entry><id>https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cre1l</id><updated>2013-07-27T07:47:35.325Z</updated><category scheme="http://schemas.google.com/spreadsheets/2006" term="http://schemas.google.com/spreadsheets/2006#list"/><title type="text">3</title><content type="text">sellerfirstname: Ben, sellerlastname: Reardon, datetaken: 19/7/2013, datereceived: 19/7/2013</content><link rel="self" type="application/atom+xml" href="https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cre1l"/><link rel="edit" type="application/atom+xml" href="https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cre1l/3a2ppgdkd7c7bk"/><gsx:boxno>3</gsx:boxno><gsx:sellerfirstname>Ben</gsx:sellerfirstname><gsx:sellerlastname>Reardon</gsx:sellerlastname><gsx:datetaken>19/7/2013</gsx:datetaken><gsx:datereceived>19/7/2013</gsx:datereceived><gsx:attributedfirstname></gsx:attributedfirstname><gsx:attributedlastname></gsx:attributedlastname></entry>',
				'id': 'https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/cre1l',
				'title': '3',
				'content': 'sellerfirstname: Ben, sellerlastname: Reardon, datetaken: 19/7/2013, datereceived: 19/7/2013',
				'_links': [],
				'boxno': '3',
				'sellerfirstname': 'Ben',
				'sellerlastname': 'Reardon',
				'datetaken': '19/7/2013',
				'datereceived': '19/7/2013',
				'attributedfirstname': '',
				'attributedlastname': ''
			},
			{
				'_xml': '<entry><id>https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/chk2m</id><updated>2013-07-27T07:47:35.325Z</updated><category scheme="http://schemas.google.com/spreadsheets/2006" term="http://schemas.google.com/spreadsheets/2006#list"/><title type="text">4</title><content type="text">sellerfirstname: Alex, sellerlastname: Reardon, datetaken: 19/7/2013, datereceived: 20/7/2013, attributedfirstname: Ben, attributedlastname: Reardon</content><link rel="self" type="application/atom+xml" href="https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/chk2m"/><link rel="edit" type="application/atom+xml" href="https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/chk2m/3af2ilh3k7omag"/><gsx:boxno>4</gsx:boxno><gsx:sellerfirstname>Alex</gsx:sellerfirstname><gsx:sellerlastname>Reardon</gsx:sellerlastname><gsx:datetaken>19/7/2013</gsx:datetaken><gsx:datereceived>20/7/2013</gsx:datereceived><gsx:attributedfirstname>Ben</gsx:attributedfirstname><gsx:attributedlastname>Reardon</gsx:attributedlastname></entry>',
				'id': 'https://spreadsheets.google.com/feeds/list/0Atd5NCMS8cy-dFo3dW5kdnlwdGplTFFBcnlNcEdQQWc/1/private/full/chk2m',
				'title': '4',
				'content': 'sellerfirstname: Alex, sellerlastname: Reardon, datetaken: 19/7/2013, datereceived: 20/7/2013, attributedfirstname: Ben, attributedlastname: Reardon',
				'_links': [],
				'boxno': '4',
				'sellerfirstname': 'Alex',
				'sellerlastname': 'Reardon',
				'datetaken': '19/7/2013',
				'datereceived': '20/7/2013',
				'attributedfirstname': 'Ben',
				'attributedlastname': 'Reardon'
			}
		];

		it('should update the sold amount for the seller', function () {

			var people = spreadsheet._process_spreadsheet([data[0]]);

			expect(people[0].prototype).to.be(person.prototype);
			expect(people[0].data).to.have.property('sold', 1);

		});

		it('should update the count of an existing person if they exist', function () {

			var rows = [data[0], data[0]];
			var people = spreadsheet._process_spreadsheet(rows);

			expect(people).to.have.length(1);
			expect(people[0].data).to.have.property('sold', rows.length);
		});

		it('should update the attributed amount to the seller if no attributed to name is given', function () {

			var people = spreadsheet._process_spreadsheet([data[0]]);

			expect(people[0].data).to.have.property('sold', 1);
			expect(people[0].data).to.have.property('attributed', 1);
		});

		it('should update the attributed amount for the attributed name and not for the seller', function () {

			var people = spreadsheet._process_spreadsheet([data[2]]);

			expect(people).to.have.length(2);

			var seller = _.find(people, function (prsn) {
				return (prsn.data.firstname === data[2].sellerfirstname &&
					prsn.data.lastname === data[2].sellerlastname);
			});

			expect(seller.data).to.have.property('sold', 1);
			expect(seller.data).to.have.property('attributed', 0);

			var beneficiary = _.find(people, function (prsn) {
				return (prsn.data.firstname === data[2].attributedfirstname &&
					prsn.data.lastname === data[2].attributedlastname);
			});

			expect(beneficiary.data).to.have.property('sold', 0);
			expect(beneficiary.data).to.have.property('attributed', 1);

		});

		it('should not process a row without required columns (date received, sellerfirstname, sellerlastname)', function () {

			var items = [
				{},
				{
					sellerfirstname: 'Alex'
				},
				{
					sellerfirstname: 'Alex',
					sellerlastname: 'Reardon'
				},
				{
					sellerfirstname: 'Alex',
					datereceived: '10/12/2000'
				},
				{
					//only one with all valid fields
					sellerfirstname: 'Alex',
					sellerlastname: 'Reardon',
					datereceived: '10/12/2000'
				}
			];

			var count = 0;

			_.each(items, function (item) {
				if (spreadsheet._process_spreadsheet([item]).length) {
					count++;
				}
			});

			expect(count).to.be(1);

		});
	});

	describe('Save data', function () {

		var firstname = 'Bob',
			lastname = 'Smith',
			data = [
				{
					firstname: firstname,
					lastname: lastname,
					sold: 1,
					attributed: 1
				},
				{
					firstname: 'Jane',
					lastname: 'Smith',
					sold: 2,
					attributed: 2
				}
			],
			people;

		beforeEach(function () {
			people = [];
			_.each(data, function (item) {
				people.push(person.create({data: item}));
			});
		});

		afterEach(function (done) {
			database.connect(function (db) {
				var collection = db.collection(person.collection_name);
				collection.drop();
				done();
			});
		});

		it.skip('should persist saved people in the database', function (done) {

		});
	});

	describe('Trim whitespace', function () {
		var firstname = 'Alex',
			lastname = 'Reardon',
			row;

		beforeEach(function () {
			row = {
				sellerfirstname: ' ' + firstname + ' ', // leading and trailing space,
				sellerlastname: ' ' + lastname + ' ' // leading and trailing space,
			};
		});

		it('should trim whitespace', function () {
			spreadsheet._trim_name_whitespaces(row);
			expect(row.sellerfirstname).to.be(firstname);
			expect(row.sellerlastname).to.be(lastname);
		});
	});

	describe.skip('Long running tests', function () {

		var timeout = 10000; //10 seconds

		it('should get data from google', function (done) {
			this.timeout(timeout);

			spreadsheet._get_spread_sheet(function (err, data) {
				if (err) {
					expect(false).to.be(true);
					throw err;
				}
				expect(data).to.be.ok();
				done();
			});
		});

		it('should run', function (done) {
			this.timeout(timeout);

			spreadsheet.run(function (err) {
				if (err) {
					expect(true).to.be(false);
				}
				expect(true).to.be(true);
				done();
			});
		});

	});

});