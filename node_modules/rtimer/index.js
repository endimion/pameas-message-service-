"use strict";


function Timer(callback, delay) {
	if (!(this instanceof Timer))
		return new Timer(callback, delay);

	this._timeout = null;
	this.delay = delay;
	this.callback = callback;
}
module.exports = Timer;

/**
 * Clear current timeout
 */
Timer.prototype.clear = function() {
	if (this._timeout) {
		clearTimeout(this._timeout);
		this._timeout = null;
	}
	return this;
};

/**
 * Set timeout and clear previous timeout
 */
Timer.prototype.set = function() {
	this.clear();
	this._timeout = setTimeout(this.callback, this.delay);
	return this;
};
