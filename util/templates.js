var _ = require('underscore'),
	fs = require('fs'),
	hbs = require('hbs'),
	path = require('path');

module.exports._load_from_directory = function (directory_path) {
	var temp = {};
	var files = fs.readdirSync(directory_path);
	_.each(files, function (file_name) {
		var text = fs.readFileSync(directory_path + '/' + file_name, 'utf8');
		temp[file_name.replace('.hbs', '')] = hbs.handlebars.compile(text);
	});
	return temp;
};

exports.helpers = exports._load_from_directory(path.join(__dirname, '../views/helpers'));
exports.email = exports._load_from_directory(path.join(__dirname, '../views/email'));