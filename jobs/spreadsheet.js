var GoogleSpreadsheet = require('google-spreadsheet'),
	_ = require('underscore'),
	config = require('../config'),
	format = require('util').format,
	database = require('../db'),
	person = require('../models/person');

//Utility functions

function getPerson(people, firstname, lastname) {


	var p = _.find(people, function(prsn) {
		return (prsn.data.firstname === firstname &&
			prsn.data.lastname === lastname);
	});

	//if none found - add it
	if(!p) {
		p = person.create({firstname: firstname, lastname: lastname});
		people.push(p);
	}

	return p;
}

//Get Data from Google

function getSpreadSheet(cb) {

	var sheet = new GoogleSpreadsheet(config.google_spreadsheet_key);

	sheet.setAuth(config.google_username, config.google_password, function(err) {
		if(err) {
			cb(err);
		}

		sheet.getRows(1, function(err, data) {
			if(err) {
				cb(err);
			}
			cb(null, data);
		});
	});


}

//Process Google Datat
// -> spreadsheet -> array[person]
function processSpreadsheet(rows) {

	var people = [];

	_.each(rows, function(row, i) {

		// required fields:
		// datareceived, sellerfirstname, sellerlastname
		if(!row.datereceived || !row.sellerfirstname || !row.sellerlastname) {
			return false;
		}

		var seller = getPerson(people, row.sellerfirstname, row.sellerlastname);
		seller.data.sold++;

		if(row.attributedfirstname && row.attributedlastname) {
			var beneficiary = getPerson(people, row.attributedfirstname, row.attributedlastname);
			beneficiary.data.attributed++;
		} else {
			seller.data.attributed++;
		}
	});

	return people;

}

//Application Flow

function run(cb) {
	//application flow

	getSpreadSheet(function(err, data) {
		if(err) {
			console.error(format('an error occured obtaining spreadsheet: %j', err));
			return;
		}

		person.saveMultiple(processSpreadsheet(data), cb);
	});
}


module.exports = {
	//public api:
	run: run,


	//test api
	_processSpreadsheet: processSpreadsheet,
	_getPerson: getPerson,
	_getSpreadSheet: getSpreadSheet

};
