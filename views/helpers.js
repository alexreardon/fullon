var hbs = require('hbs'),
	format = require('util').format,
	_ = require('underscore');

function leaderboard (people) {

	var result = '',
		previous_position = 0,
		css = 'secondary';

	_.each(people, function (person) {

		if (person.temp.position !== previous_position) {
			previous_position = person.temp.position;

			css = (css === 'primary' ? 'secondary' : 'primary');

			result += format('<tr class="first_row %s">', css);
			result += format('<td class="position" rowspan="%s"><div class="fill">%s</div></td>', (person.temp.shared + 1), person.temp.position);

		} else {
			result += format('<tr class="%s">', css);
		}

		result += format('<td class="name">%s %s</td><td><div class="boxes_sold">%s</div></td></tr>', person.data.firstname, person.data.lastname, person.data.sold);
	});

	return new hbs.handlebars.SafeString(result);

}

hbs.registerHelper('leaderboard', leaderboard);

