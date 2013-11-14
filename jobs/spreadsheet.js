var GoogleSpreadsheet = require('google-spreadsheet'),
	_ = require('underscore'),
	config = require('../config'),
	format = require('util').format,
	database = require('../util/db'),
	person = require('../models/person');

//Utility functions

function get_person (people, firstname, lastname) {

	var p = _.find(people, function (prsn) {
		return (prsn.data.firstname === firstname &&
			prsn.data.lastname === lastname);
	});

	//if none found - add it
	if (!p) {
		p = person.create({data: {firstname: firstname, lastname: lastname}});
		people.push(p);
	}

	return p;
}

//Get Data from Google

function get_spread_sheet (cb) {

	var sheet = new GoogleSpreadsheet(config.google_spreadsheet_key);

	sheet.setAuth(config.google_username, config.google_password, function (err) {
		if (err) {
			cb(err);
		}

		sheet.getRows(1, function (err, data) {
			if (err) {
				cb(err);
			}
			cb(null, data);
		});
	});

}

function trim_name_whitespaces (spreadsheet_row) {
	spreadsheet_row.sellerfirstname = spreadsheet_row.sellerfirstname.trim();
	spreadsheet_row.sellerlastname = spreadsheet_row.sellerlastname.trim();

	if (spreadsheet_row.attributedfirstname && spreadsheet_row.attributedlastname) {
		spreadsheet_row.attributedfirstname = spreadsheet_row.attributedfirstname.trim();
		spreadsheet_row.attributedlastname = spreadsheet_row.attributedlastname.trim();
	}
}

//Process Google Datat
// -> spreadsheet -> array[person]
function process_spreadsheet (rows) {

	var people = [];

	_.each(rows, function (row, i) {

		// required fields:
		// datareceived, sellerfirstname, sellerlastname
		if (!row.datereceived || !row.sellerfirstname || !row.sellerlastname) {
			return false;
		}

		// trim whitespace on names
		trim_name_whitespaces(row);

		var seller = get_person(people, row.sellerfirstname, row.sellerlastname);
		seller.data.sold++;

		if (row.attributedfirstname && row.attributedlastname) {
			var beneficiary = get_person(people, row.attributedfirstname, row.attributedlastname);
			beneficiary.data.attributed++;
		} else {
			seller.data.attributed++;
		}
	});

	return people;

}



//Application Flow

function run (cb) {
	//application flow

	get_spread_sheet(function (err, data) {
		if (err) {
			console.error(format('an error occured obtaining spreadsheet: %j', err));
			cb(err);
			return;
		}

		person.save_multiple(process_spreadsheet(data), cb);
	});
}

module.exports = {
	//public api:
	run: run,

	//test api
	_process_spreadsheet: process_spreadsheet,
	_get_person: get_person,
	_get_spread_sheet: get_spread_sheet,
	_trim_name_whitespaces: trim_name_whitespaces

};
