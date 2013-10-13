fullon.views.register.basic = Backbone.View.extend({

	initialize: function () {

		this.$basic_fields = $('input[name=first_name], input[name=last_name], input[name=email]', '#basic');

		this.$basic_fields.on('change', function () {
			console.log('basic info updated - update auto complete fields');
			fullon.vent.trigger('basic_info:update');
		});

		fullon.vent.on('chocolate_dropdown:change', this.on_chocolate_dropdown_change, this);
		fullon.vent.on('chocolate_dropdown:remove', this.on_chocolate_dropdown_remove, this);

	},

	on_chocolate_dropdown_remove: function () {
		console.log('basic: on_chocolate_dropdown_remove');
		this.$basic_fields.filter('[name=first_name]').val('').attr('disabled', false);
		this.$basic_fields.filter('[name=last_name]').val('').attr('disabled', false);
	},

	on_chocolate_dropdown_change: function (data) {
		console.log('basic: on_chocolate_dropdown_change', data);
		this.$basic_fields.filter('[name=first_name]').val(data.first_name).attr('disabled', true);
		this.$basic_fields.filter('[name=last_name]').val(data.last_name).attr('disabled', true);

		// let other views know that the basic info has updated
		fullon.vent.trigger('basic_info:update');
	}
});

