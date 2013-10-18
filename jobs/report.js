var registration = require('../models/registration'),
	schema = require('../forms/register/schema').populate(),
	_ = require('underscore'),
	S = require('string');

var new_line = '\r\n';

function get_column_names (_schema) {

	// first column is the _id field
	var columns = ['_id'];
	_.each(_schema, function (section) {
		_.each(section.fields, function (field) {
			columns.push(field.name);
		});
	});

	return columns;
}

function get_registration_row (columns, reg) {
	// first entry is the _id
	var row = [reg._id];

	_.each(columns, function (col) {
		row.push(reg.data[col]);
	});

	return row;
}

function get_csv_row (array) {
	return (S(array).toCSV({delimiter: ',', qualifier: '"'}) + new_line);
}

// return a CSV of all of the current registrations
function run (cb) {

	registration.find({}, function (err, registrations) {
		if (err) {
			return cb(err);
		}

		var buffer = '',
			cols = get_column_names(schema);

		buffer += get_csv_row(cols);
		// remove the _id col
		cols = cols.slice(1);

		_.each(registrations, function (reg) {
			buffer += get_csv_row(get_registration_row(cols, reg));
		});

		cb(null, buffer);
	});

}

module.exports = {
	//public api:
	run: run,

	//test api
	_get_column_names: get_column_names,
	_get_registration_row: get_registration_row,
	_get_csv_row: get_csv_row
};
