function init () {
	var router = new FullOn.Routers.Register();

	Backbone.history.start({
		pushState: true
	});
}

init();