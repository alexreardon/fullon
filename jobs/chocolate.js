var GoogleSpreadsheet = require("google-spreadsheet"),
	_ = require('underscore'),
	config = require('../config'),
	MongoClient = require('mongodb').MongoClient,
	format = require('util').format;

function getSpreadSheet(){

	var sheet = new GoogleSpreadsheet(config.google_spreadsheet_key);

	sheet.setAuth(config.google_username, config.google_password, function(err){
		if(err){
			throw new Error('error with authentication: ' + err);
		}

		sheet.getRows(1, function(err, data){
			if(err){
				throw new Error('error getting spreadsheet: ' + err);
			}
			return data;
		});
	});


}



function Person(firstname, lastname, sold, attributed){
	this.firstname = firstname;
	this.lastname = lastname;
	this.sold = sold || 0;
	this.attributed = attributed || 0;
}

function process(rows){

	var people = [];

	_.each(rows, function(row, i){

		// required fields:
		// datareceived, sellerfirstname, sellerlastname
		if(!row.datereceived || !row.sellerfirstname || !row.sellerlastname){
			return false;
		}

		var seller = getPerson(people, row.sellerfirstname, row.sellerlastname);
		seller.sold++;

		if(row.attributedfirstname && row.attributedlastname){
			var beneficiary = getPerson(people, row.attributedfirstname, row.attributedlastname);
			beneficiary.attributed++;
		} else {
			seller.attributed++;
		}
	});

	return people;

}

function getPerson(people, firstname, lastname){
	var person = _.find(people, function(item){
		return (item.firstname === firstname &&
			item.lastname === lastname)
	});

	//if none found - add it
	if(!person){
		person = new Person(firstname, lastname);
		people.push(person);
	}

	return person;
}

function save(people){
	//save people into monogodb
	console.log('trying to connect');
	MongoClient.connect(config.db_connection, function(err, db){
		if(err){
			console.log(err);
			throw err;
		}

		var collection = db.collection('chocolate');

		console.log('about to insert');

		_.each(people, function(person){
			collection.update(
				{firstname: person.firstname, lastname: person.lastname}, //query
				{$set: { sold: person.sold, attributed: person.attributed}}, //change values
				{upsert: true}, //options - upsert: create if none found
				function(err){
					if(err){
						throw err;
					}
					console.log(format('successfully updated: %s %s', person.firstname, person.lastname));
				}
			);
		});

		//1. drop all existing data
		//2. insert new data
//		collection.drop(function(err, result){
//			if(err){
//				throw err;
//			}
//			//for each row in people:
//			//collection.insert(person...
//
////			collection.insert(people, function(err, docs) {
////				if(err){
////					throw err;
////				}
////				console.log('successfully inserted people into database');
////				db.close();
////			});
//		});

	});
}


module.exports = {
	//public api:
	process: process,


	//test api
	_getPerson: getPerson,
	_Person: Person,
	_save: save

};
//
//save([
//	{
//		firstname: 'alex',
//		lastname: 'test',
//		sold: 1,
//		attributed: 1
//	},
//	{
//		firstname: 'Jane',
//		lastname: 'Smith',
//		sold: 2,
//		attributed: 3
//	}
//]);