/*
 * Created on Mon Apr 24 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

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
		let seconds = date.getUTCSeconds();
		let minutes = date.getUTCMinutes();
		seconds = (seconds < 10) ? '0' + seconds : seconds;
		minutes = (minutes < 10) ? '0' + minutes : minutes;
		let logItem = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}_${date.getUTCHours()}:${minutes}:${seconds} - [${type.text}] - ${msg}\r\n`;
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
