var expect = require('expect.js'),
	report = require('../jobs/report'),
	_ = require('underscore'),
	S = require('string'),
	registration = require('../models/registration');

describe.only('Reporting Job', function () {

	describe('create csv rows', function () {

		var row,
			result;

		beforeEach(function () {
			row = ['a', 'b', 'c'];
			result = report._get_csv_row(row);
		});

		it('should add a new line to end of line', function () {
			expect(S(result).endsWith('\r\n')).to.be(true);
		});

		it('should convert array to csv', function(){
			expect(S(result).chompRight('\r\n').parseCSV()).to.eql(row);
		});

		it('should add "" for empty values', function(){
			row = [null, undefined, ''];
			result = S(report._get_csv_row(row)).chompRight('\r\n');

			expect(result.s).to.be('"","",""');
		});
	});

	describe('get column names', function(){
		it('should create an _id column', function(){
			var cols = report._get_column_names();
			expect(cols.length).to.be(1);
			expect(cols[0]).to.be('_id');
		});

		it('should get column names from schema', function () {
			var schema = {
				section1: {
					name: 'section1',
					fields: {
						field1: {
							name: 'field1'
						},
						field2: {
							name: 'field2'
						}
					}
				}
			};
			var cols = report._get_column_names(schema);

			// first col is _id
			expect(cols[1]).to.be(schema.section1.fields.field1.name);
			expect(cols[2]).to.be(schema.section1.fields.field2.name);
			expect(cols.length).to.be(_.size(schema.section1.fields) + 1);
		});
	});



	describe('create registration rows', function () {

		var reg,
			first_name = 'Alex',
			last_name = '',
			cols = ['first_name', 'last_name', 'age'],
			data = {
				first_name: first_name,
				last_name: last_name
			};

		beforeEach(function(){
			reg = registration.create(data);
		});

		it('should put the id of the registation in the first column', function(){
			var row = report._get_registration_row(null, reg);
			expect(row[0]).to.be(reg._id);
		});

		it('should fill in columns', function(){
			var row = report._get_registration_row(cols, reg);

			// [0] = _id
			expect(row[1]).to.be(first_name);
			expect(row[2]).to.be(last_name);
			expect(row[3]).to.be(undefined);
			expect(row.length).to.be(cols.length + 1);
		});
	});

});