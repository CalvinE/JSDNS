/*
 * Created on Mon Apr 24 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const Utilities = require('../../utilities');

/**
 * @name ConsoleLogger
 * @class
 * @access public
 *
 * @description A utility class for logging information to the console log from the DNS server.
 */
let ConsoleLogger = function () {
	function log (msg, type, date) {
		if (typeof msg === 'object') {
			msg = JSON.stringify(msg);
		} else {
			msg = msg.toString();
		}
		let logItem = `${Utilities.getUTCDateStringFileSafe(date)} - [${type.text}] - ${msg}\r\n`;
		switch (type.name) {
		case 'error':
			console.error(logItem);
			break;
		default:
			console.log(logItem);
		};
	}

	return {
		log: log
	};
};

module.exports = ConsoleLogger;
