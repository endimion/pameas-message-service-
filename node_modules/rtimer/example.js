"use strict";

var rtimer = require('./index');

var start_time = +new Date();

// create new timeout with 1000ms delay
var timeout = rtimer(function() {
	// this will be triggered after 1500ms
	// because of the reset
	var t = (+new Date() - start_time);
	console.log('time ' + t + ' ms');

	// re-use timeout with different delay and callback
	timeout.delay = 500;
	timeout.callback = function() {
		console.log('Hello World!');
	};
	// reset timeout
	timeout.set();
}, 1000);

// reset timeout after 500ms
setTimeout(function() {
	timeout.set();
}, 500);

