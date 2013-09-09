var FormItem = require('../model/formitem.js');

var FormSection = Backbone.Collection.extend({
	model: FormItem
});