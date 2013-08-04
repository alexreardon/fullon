var GoogleSpreadsheet = require('google-spreadsheet'),
	_ = require('underscore'),
	config = require('../config'),
	format = require('util').format,
	database = require('../db'),
	Person = require('../models/Person');

//Utility functions

function getPerson(people, firstname, lastname) {
	var person = _.find(people, function(item) {
		return (item.firstname === firstname &&
			item.lastname === lastname);
	});

	//if none found - add it
	if(!person) {
		person = new Person({firstname: firstname, lastname: lastname});
		people.push(person);
	}

	return person;
}

function updatePerson(person, collection, cb) {

	collection.update(
		{firstname: person.firstname, lastname: person.lastname}, //query
		{$set: { sold: person.sold, attributed: person.attributed}}, //change values
		{upsert: true}, //options - upsert: create if none found
		function(err) {

			if(err) {
				cb(err);
			}

			cb(null, person);
		}
	);
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

//Process Google Data

function processSpreadsheet(rows) {

	var people = [];

	_.each(rows, function(row, i) {

		// required fields:
		// datareceived, sellerfirstname, sellerlastname
		if(!row.datereceived || !row.sellerfirstname || !row.sellerlastname) {
			return false;
		}

		var seller = getPerson(people, row.sellerfirstname, row.sellerlastname);
		seller.sold++;

		if(row.attributedfirstname && row.attributedlastname) {
			var beneficiary = getPerson(people, row.attributedfirstname, row.attributedlastname);
			beneficiary.attributed++;
		} else {
			seller.attributed++;
		}
	});

	return people;

}

//Save Processed Data

function save(people, collection_name, cb) {
	//save people into monogodb

	var finished = 0,
		errors = [],
		added = [];

	database.connect(function(db){

		var collection = db.collection(collection_name);


		for(var i = 0; i < people.length; i++) {
			//noinspection JSHint
			updatePerson(people[i], collection, function(err, person) {
				if(err) {
					errors.push({
						data: person,
						err: err
					});
				} else {
					added.push(person);
				}

				finished++;
				if(finished === people.length) {
					db.close();
					cb(errors, added);
				}
			});
		}

	});
}

//Application Flow

function run(collection_name, cb) {
	//application flow

	getSpreadSheet(function(err, data) {
		if(err) {
			cb(err);
		}
		save(processSpreadsheet(data), collection_name, function(notadded, added) {
			if(notadded.length) {
				console.error('people not saved', notadded);
			}
			cb(null);
		});
	});
}


module.exports = {
	//public api:
	run: run,


	//test api
	_processSpreadsheet: processSpreadsheet,
	_getPerson: getPerson,
	_Person: Person,
	_save: save,
	_getSpreadSheet: getSpreadSheet

};
