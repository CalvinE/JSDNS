/*
 * Created on Fri Apr 21 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const fs = require('fs');
const Utilities = require('../../utilities');

/**
 * @name FSLogger
 * @class
 * @access public
 *
 * @description A utility class for logging information to the file system frommthe DNS server.
 */
let FSLogger = function (config) {
    /**
     * @name loggerDir
     * @type {String}
     * @access private
     *
     * @description This is the directory the log files from the server will be made.
     */
	let loggerDir = config.baseDir;

    /**
     * @name requestCounter
     * @type {Number}
     * @access private
     *
     * @description This is just an auto incrementing counter for each item logged.
     */
	let logCounter = 0;

	function getCurrentLogFileName (date) {
		return `${loggerDir}JSDNS_LOG_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getUTCHours()}.txt`;
	};

	function logToFile (filePath, msg, type, date) {
		logCounter += 1;
		if (typeof msg === 'object') {
			msg = JSON.stringify(msg);
		} else {
			msg = msg.toString();
		}
		let seconds = date.getUTCSeconds();
		seconds = (seconds < 10) ? '0' + seconds : seconds;
		let logItem = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}_${date.getUTCHours()}:${date.getUTCMinutes()}:${seconds} - [${type.text}] - #${logCounter} - ${msg}\r\n`;
		fs.appendFile(filePath, logItem, (err) => {
			if (Utilities.isNullOrUndefined(err) === false) {
				throw err;
			}
		});
	}

    /**
     * @name log
     * @function
     *
     * @description
     */
	function log (msg, type, date) {
		let filePath = getCurrentLogFileName(date);
		fs.access(loggerDir, fs.constants.R_OK | fs.constants.W_OK | fs.constants.F_OK, (err) => {
			if (Utilities.isNullOrUndefined(err) === false) {
				if (err.code === 'ENOENT') {
					fs.mkdir(loggerDir, (err) => {
						if (Utilities.isNullOrUndefined(err) === false) {
							throw err;
						} else {
							logToFile(filePath, msg, type, date);
						}
					});
				}
			} else {
				logToFile(filePath, msg, type, date);
			}
		});
	}

	return {
		log: log
	};
};

module.exports = FSLogger;
