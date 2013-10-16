/*! stphils-fullon2014 - v0.0.4 - 17-10-2013 */!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require){window.fullon={},fullon.views={},fullon.views.register={},fullon.routers={},fullon.routers.register={},fullon.vent={},_.extend(fullon.vent,Backbone.Events),fullon.validation=require("../../util/validation"),fullon.validation.is_letters.fn("test"),fullon.validation.min_length.fn("test"),fullon.state={},fullon.views.common=Backbone.View.extend({initialize:function(){this.$sections=$("section"),this.$footer=$("footer"),this.$nav=$("header .navbar");var throttled_resize=_.throttle(function(){this.resize()}.bind(this),100);this.resize(),$(window).on("resize",function(){throttled_resize()}.bind(this)),$(".datepicker").datepicker({format:"dd/mm/yyyy",autoclose:!0}),this.$nav.find("a").on("click",function(){this.$nav.find(".navbar-collapse").collapse("hide")}.bind(this))},resize:function(){console.log("window resize - common");var self=this;this.$sections.each(function(){$(this).css("min-height",self.get_min_height())})},get_min_height:function(){return $(window).height()-this.$nav.height()-this.$footer.height()}}),function(){new fullon.views.common}()},{"../../util/validation":2}],2:[function(require,module,exports){var regex={email:/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,number:/^\d+$/,letters:/^[a-zA-Z]+[a-zA-Z\s]*$/,date:/^[\d]{2}\/[\d]{2}\/[\d]{4}$/,money:/^[\d,]+?$/},rules={min_length:{fn:function(input,length){return input&&input.length&&input.length>=length||!1},text:"must be at least {0} characters in length"},max_length:{fn:function(input,length){return input&&input.length&&input.length<=length||!1},text:"cannot be longer then {0} characters"},required:{fn:function(input){return input&&input.length&&input.length>0||!1},text:"this is a required field"},is_letters:{fn:function(input){return regex.letters.test(input)},text:"must be letters only"},is_numbers:{fn:function(input){return regex.number.test(input)},text:"must be numbers only"},is_email:{fn:function(input){return regex.email.test(input)},text:"must be in email format (eg 'example@email.com')"},is_date:{fn:function(input){return regex.date.test(input)},text:"date is expected the format: DD/MM/YYYY"},is_money:{fn:function(input){return regex.money.test(input)},text:"money is expected in the format: 10 or 10,000 or 10000 (no '$' or decimal points)"},value:{fn:function(input,value){return input===value},text:"value must be '{0}'"}};module.exports=exports=rules},{}]},{},[1]);