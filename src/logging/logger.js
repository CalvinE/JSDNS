/*
 * Created on Sat Feb 18 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const config = require('./logging-config.json');
const Utilities = require('../utilities');

/**
 * @name Logger
 * @static
 *
 * @description This is the primary logging construct in this application. It works on a logging module system and is easily extensible to allow logging to anything you can imagine! Since this is just a shell that calls the logging providers it is the providers responsibility to handle the message content. For instance it is a string or if it is an object handle it accordingly.
 */
let Logger = (() => {
	let isInit = false;

	let providers = [];

	let logTypes = config.logTypes;

	let logQueue = [];

	let currentLogLevel = logTypes[config.logLevel];

	let processLogInterval = null;

	function init () {
		if (isInit === false) {
			for (let i = 0; i < config.providers.length; i++) {
				let Provider = require(config.providers[i].path);
				let providerConfig = require(config.providers[i].config);
				Provider = new Provider(providerConfig);
				providers.push(Provider);
			}
			isInit = true;
		}
	};

	function log (msg, type) {
		if (Utilities.isNullOrUndefined(msg)) { // In this instance we do not log because the message is null or empty...
			return;
		} else if (Utilities.isNullOrUndefined(type)) {
			type = logTypes[config.defaultLogLevel];
		}

		if (type.value < currentLogLevel.value) { // If this is true the message does not meet the threshold for logging and discarded.
			return;
		}

		logQueue.push({
			msg: msg,
			type: type
		});
	};

	function flushLogQueue () {
		clearInterval(processLogInterval);
		while (logQueue.length !== 0) {
			logItem(logQueue.shift());
		}
	}

	function logItem (item) {
		for (let i = 0; i < providers.length; i++) {
			let currentProvider = null;
			try {
				currentProvider = providers[i].name;
				providers[i].log(item.msg, item.type);
			} catch (e) {
				// TODO: should I log an error in a logging provider :-)
				console.error(e, currentProvider);
			}
		}
	}

	processLogInterval = setInterval(() => {
		let item = logQueue.shift();
		if (Utilities.isNullOrUndefined(item) === false) {
			logItem(item);
		}
	}, 500);

	return {
		init: init,
		logTypes: logTypes,
		log: log,
		flushLogQueue: flushLogQueue
	};
})();

Logger.init();

module.exports = Logger;
