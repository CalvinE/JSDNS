/*
 * Created on Sat Feb 18 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const config = require('./logging-config.json');

let Logger = () => {
	let isInit = false;

	let providers = [];

	let logTypes = {
		'debug': 'D',
		'error': 'E'
	};

	function init () {
		if (isInit === true) {
			for (let i = 0; i < config.providers.length; i++) {
				providers.push(require(config.providers[i]));
			}
		}
	};

	function logString (str, type) {
		log(str, type);
	};

	function logJSON (obj, type) {
		log(JSON.stringify(obj), type);
	};

	function log (str, type) {
		var msg = `${new Date().toString()} - [E] - ${str}`;
		for (let i = 0; i < providers.length; i++) {
			providers[i].log(msg);
		}
	};

	return {
		init: init,
		logTypes: logTypes,
		logString: logString,
		logJSON: logJSON
	};
};

Logger.init();

module.exports = Logger;
