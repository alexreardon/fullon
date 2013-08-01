var expect = require('expect.js'),
	spreadsheet = require('../jobs/spreadsheet'),
	config = require('../config'),
	_ = require('underscore'),
	MongoClient = require('mongodb').MongoClient;

describe('Get Spreadsheet Data', function() {


	describe('getPerson', function() {

		var people,
			firstname = 'Bob',
			lastname = 'Smith',
			length;

		beforeEach(function() {

			//reset for each test
			people = [
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
			];

			length = people.length;

		});

		it('should find a match', function() {
			var person = spreadsheet._getPerson(people, firstname, lastname);
			expect(person).to.equal(people[0]);
		});

		it('should not create a new person when a match is found', function() {

			var person = spreadsheet._getPerson(people, 'Bob', 'Smith');
			expect(people).to.have.length(length);
		});

		it('should create a new person when a match is not found', function() {

			var person = spreadsheet._getPerson(people, firstname + 'newText', lastname + 'newText');
			expect(people).to.have.length(length + 1);
		});
	});

	describe('Process data', function() {

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


		it('should update the sold amount for the seller', function() {


			var people = spreadsheet._processSpreadsheet([data[0]]);

			expect(people[0]).to.be.a(spreadsheet._Person);
			expect(people[0]).to.have.property('sold', 1);

		});

		it('should update the count of an existing person if they exist', function() {

			var rows = [data[0], data[0]];
			var people = spreadsheet._processSpreadsheet(rows);

			expect(people).to.have.length(1);
			expect(people[0]).to.have.property('sold', rows.length);
		});

		it('should update the attribute amount to the seller if no attributed to name is given', function() {

			var people = spreadsheet._processSpreadsheet([data[0]]);

			expect(people[0]).to.have.property('sold', 1);
			expect(people[0]).to.have.property('attributed', 1);
		});

		it('should update the attributed amount for the attributed name and not for the seller', function() {

			var people = spreadsheet._processSpreadsheet([data[2]]);

			expect(people).to.have.length(2);

			var seller = _.find(people, function(person) {
				return (person.firstname === data[2].sellerfirstname &&
					person.lastname === data[2].sellerlastname);
			});

			expect(seller).to.have.property('sold', 1);
			expect(seller).to.have.property('attributed', 0);

			var beneficiary = _.find(people, function(person) {
				return (person.firstname === data[2].attributedfirstname &&
					person.lastname === data[2].attributedlastname);
			});

			expect(beneficiary).to.have.property('sold', 0);
			expect(beneficiary).to.have.property('attributed', 1);

		});


		it('should not process a row without required columns (date received, sellerfirstname, sellerlastname)', function() {

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

			_.each(items, function(item) {
				if(spreadsheet._processSpreadsheet([item]).length) {
					count++;
				}
			});

			expect(count).to.be(1);


		});

	});

	describe('Save data', function() {

		var firstname = 'Bob',
			lastname = 'Smith',
			people = [
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
			];

		afterEach(function() {
			MongoClient.connect(config.db_connection, function(err, db) {
				if(err) {
					expect().fail();
				}
				var collection = db.collection('spreadsheet');
				collection.drop();
			});
		});

		function findPersonInDatabase(firstname, lastname, cb) {
			MongoClient.connect(config.db_connection, function(err, db) {
				if(err) {
					expect().fail();
				}
				var collection = db.collection('spreadsheet');
				collection.find({firstname: firstname, lastname: lastname}).toArray(function(err, docs) {
					cb(docs[0]);
				});
			});
		}


		it('should return the saved people in the database', function(done) {
			spreadsheet._save(people, function(notadded, added) {
				if(notadded && notadded.length > 0) {
					console.error(notadded);
					expect(true).to.be(false);
				}

				var sort = function(item) {
					return item.firstname;
				};

				expect(added.length).to.be(people.length);
				expect(_.isEqual(added, people)).to.be(true);

				done();

			});
		});

		it('should persist saved people in the database', function(done) {
			spreadsheet._save(people, function(notadded, added) {
				if(notadded && notadded.length > 0) {
					console.error(notadded);
					expect(true).to.be(false);
				}

				findPersonInDatabase(people[0].firstname, people[0].lastname, function(person) {
					var count = 0;
					_.each(people, function(person, i) {
						if(people[i].firstname === person.firstname &&
							people[i].lastname === person.lastname &&
							people[i].sold === person.sold &&
							people[i].attributed === person.attributed) {
							count++;
						}
					});
					expect(count).to.be(people.length);

					done();
				});


			});

		});
	});


	describe.skip('Long running tests', function() {

		var timeout = 10000; //10 seconds

		it('should get data from google', function(done) {
			this.timeout(timeout);

			spreadsheet._getSpreadSheet(function(err, data) {
				if(err) {
					expect(false).to.be(true);
					throw err;
				}
				expect(data).to.be.ok();
				done();
			});
		});

		it('should run', function(done) {
			this.timeout(timeout);

			spreadsheet.run(function(err) {
				if(err) {
					expect(true).to.be(false);
				}
				expect(true).to.be(true);
				done();
			});
		});

	});


});