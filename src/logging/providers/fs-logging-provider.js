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

	function getCurrentLogFileName (date) {
		return `JSDNS_LOG_${Utilities.getUTCDateStringFileSafe(date)}.txt`;
	};

	function logToFile (filePath, msg, type, date) {
		if (typeof msg === 'object') {
			msg = JSON.stringify(msg);
		} else {
			msg = msg.toString();
		}
		let logItem = `${Utilities.getUTCDateStringFileSafe(date)} - [${type.text}] - ${msg}\r\n`;
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
		let filePath = loggerDir + getCurrentLogFileName(date);
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
