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

	function getCurrentLogFileName () {
		let d = new Date();
		return `${loggerDir}JSDNS_LOG_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getUTCHours()}.txt`;
	};

	function logToFile (filePath, msg, type) {
		logCounter += 1;
		if (typeof msg === 'object') {
			msg = JSON.stringify(msg);
		} else {
			msg = msg.toString();
		}
		let d = new Date();
		let seconds = d.getUTCSeconds();
		seconds = (seconds < 10) ? '0' + seconds : seconds;
		let logItem = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}_${d.getUTCHours()}:${d.getUTCMinutes()}:${seconds} - [${type.text}] - #${logCounter} - ${msg}\r\n`;
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
	function log (msg, type) {
		let filePath = getCurrentLogFileName();
		fs.access(loggerDir, fs.constants.R_OK | fs.constants.W_OK | fs.constants.F_OK, (err) => {
			if (Utilities.isNullOrUndefined(err) === false) {
				if (err.code === 'ENOENT') {
					fs.mkdir(loggerDir, (err) => {
						if (Utilities.isNullOrUndefined(err) === false) {
							throw err;
						} else {
							logToFile(filePath, msg, type);
						}
					});
				}
			} else {
				logToFile(filePath, msg, type);
			}
		});
	}

	return {
		log: log
	};
};

module.exports = FSLogger;
