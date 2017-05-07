/*
 * Created on Wed Apr 19 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

/**
 * @name ErrorInstance
 * @class
 * @access private
 * @description This is an instance of an error and contains both a msg and data associated with the error.
 *
 * @param {string} msg
 * @param {object} data
 */
function ErrorInstance (msg, data) {
	this.msg = msg;
	this.data = data;

	this.toString = () => {
		return `${this.msg}: ${JSON.stringify(this.data)}`;
	};
};

/**
 * @name ErrorFactory
 * @access public
 * @description This is a factory object that will return new ErrorInstances.
 *
 * @param {string} msg
 * @param {object} data
 *
 * @returns {ErrorInstance}
 */
let ErrorFactory = (msg, data) => {
	return new ErrorInstance(msg, data);
};

module.exports = ErrorFactory;
