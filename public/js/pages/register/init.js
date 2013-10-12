// registration


(function(){
	function init () {
		var router = new fullon.routers.register();

		Backbone.history.start({
			pushState: true
		});
	}

	init();
})();
