//using the revealing prototype pattern


var Countdown = function($el){
	this.end = moment('01/01/2014', 'DD/MM/YYYY');

	this.$values = {
		days: $el.find('#days h3'),
		hours: $el.find('#hours h3'),
		minutes: $el.find('#minutes h3'),
		seconds: $el.find('#seconds h3')
	};

//	this.$days = $el.find('#days h3');
//	this.$hours = $el.find('#hours h3');
//	this.$minutes = $el.find('#minutes h3');
//	this.$seconds = $el.find('#seconds h3');
};

Countdown.prototype = (function(window, undefined){

	function print(values){

		_.each(values, function(item, i){

			//add leading 0
			item = (item < 10 ? '0' + item : '' + item);

			if(this.$values[i].html() !== item){
				this.$values[i].html(item);
			}

		}, this);
	}

	function update(){
		var that = this,
			now = moment(),
			diff = this.end.diff(now),
			duration = moment.duration(diff);

		print.call(this, {
			days: Math.ceil(duration.asDays()),
			hours: duration.hours(),
			minutes: duration.minutes(),
			seconds: duration.seconds()
		});


		//if countdown is not finished - call again in one second
		if(now.isBefore(this.end)){
			setTimeout(function(){
				update.call(that);
			}, 1000);
		}
	}

	function start(){
		console.log('countdown started');
		update.call(this);
	}


	//public api
	return {
		start: start
	};


})(window);
