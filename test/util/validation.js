var expect = require('expect.js'),
	config = require('../../config'),
	validation = require('../../util/validation'),
	_ = require('underscore');

describe('Validation', function () {

	describe('min_length', function () {
		var input = 'test';

		it('should allow entries long enough', function () {
			expect(validation.min_length.fn(input, input.length)).to.be(true);
		});

		it('should block entries to short', function () {
			expect(validation.min_length.fn(input, input.length + 1)).to.be(false);
		});

		it('should block dumb entries', function () {
			expect(validation.min_length.fn(undefined, 0)).to.be(false);
			expect(validation.min_length.fn(null, 0)).to.be(false);
		});
	});

	describe('max_length', function () {
		var input = 'test';

		it('should allow entries that are shorter than max', function () {
			expect(validation.max_length.fn(input, input.length)).to.be(true);
			expect(validation.max_length.fn(input, input.length + 1)).to.be(true);
		});

		it('should block entries that are too long', function () {
			expect(validation.max_length.fn(input + 'hello', input.length)).to.be(false);
		});

		it('should block dumb entries', function () {
			expect(validation.max_length.fn(null, input.length)).to.be(false);
		});

	});

	describe('required', function () {
		it('should allow all valid values through', function () {
			expect(validation.required.fn('hi')).to.be(true);
			expect(validation.required.fn('12334')).to.be(true);
		});

		it('should block illegal entries', function () {
			expect(validation.required.fn('')).to.be(false);
			expect(validation.required.fn(null)).to.be(false);
		});
	});

	describe('is_letters', function () {
		it('should allow letters and spaces', function () {
			expect(validation.is_letters.fn('hello')).to.be(true);
			expect(validation.is_letters.fn('Hello')).to.be(true);
			expect(validation.is_letters.fn('Hello World')).to.be(true);
		});

		it('should block numbers', function () {
			expect(validation.is_letters.fn('1')).to.be(false);
			expect(validation.is_letters.fn('Hello1')).to.be(false);
			expect(validation.is_letters.fn('Hello World1')).to.be(false);
		});

		it('should block special characters', function () {
			expect(validation.is_letters.fn('!')).to.be(false);
			expect(validation.is_letters.fn('Hello@')).to.be(false);
			expect(validation.is_letters.fn('Hello.World')).to.be(false);
		});

		it('should block just whitespace', function () {
			expect(validation.is_letters.fn(' ')).to.be(false);
		});

		it('should allow the "-" character', function () {
			expect(validation.is_letters.fn('hello-world')).to.be(true);
		});

		it('should allow the "\'" character', function () {
			expect(validation.is_letters.fn('O\'Reardon')).to.be(true);
		});

	});

	describe('is_numbers', function () {
		it('should allow numbers', function () {
			expect(validation.is_numbers.fn('1')).to.be(true);
			expect(validation.is_numbers.fn('909090')).to.be(true);
		});
		it('should block numbers with whitespace', function () {
			expect(validation.is_numbers.fn('1 ')).to.be(false);
			expect(validation.is_numbers.fn('909090 1')).to.be(false);
		});
		it('should block numbers with other characters', function () {
			expect(validation.is_numbers.fn('1!')).to.be(false);
			expect(validation.is_numbers.fn('909090!1')).to.be(false);
		});
	});

	describe('is_email', function () {
		it('should allow for valid emails', function () {
			var valid = [
				'test@gmail.com',
				'test.hi@gmail.com',
				'test_+.hi@gmail.com',
				'A.failtest_+.hi@gmail.com',
				'A.failtest_+.hi@gmail.com.au'
			];

			expect(_.every(valid, function (item) {
				return validation.is_email.fn(item);
			})).to.be(true);
		});

		it('should block invalid emails', function () {
			var invalid = [
				'test@gmail',
				'test.gmail.com',
				'test',
				'test123',
				'test@test@test.com',
				'test@.com'
			];

			expect(_.every(invalid, function (item) {
				return validation.is_email.fn(item);
			})).to.be(false);
		});
	});

	describe('is_date', function () {
		it('should accept DD/MM/YYYY', function () {
			var valid = [
				'10/12/1987',
				'01/01/1000'
			];

			expect(_.every(valid, function (item) {
				return validation.is_date.fn(item);
			})).to.be(true);
		});

		it('should reject other values', function () {
			var invalid = [
				'1/12/1987',
				'01/1/1000',
				'01/11/100',
				'X1/12/1987',
				'test',
				'123/23/2333'
			];

			expect(_.every(invalid, function (item) {
				return validation.is_date.fn(item);
			})).to.be(false);
		});

	});

	describe('is_money', function () {
		it('should accept money', function () {
			var valid = [
				'0',
				'100',
				'100,000,00'
			];

			expect(_.every(valid, function (item) {
				return validation.is_money.fn(item);
			})).to.be(true);
		});

		it('should reject other values', function () {
			var invalid = [
				'1/12/1987',
				'-5',
				'0.5',
				'.5',
				'1010.000.00',
				'$3'
			];

			expect(_.every(invalid, function (item) {
				return validation.is_money.fn(item);
			})).to.be(false);
		});

	});
});
