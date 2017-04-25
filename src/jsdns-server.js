/*
 * Created on Sat Jan 28 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');
let Logger = require('./logging/logger');

/**
 *
 *
 * @returns public interface for this module.
 */
function JSDNS () {
	let config = null;

  /**
   *
   *
   * @param {any} config
   */
	function init (_config) {
		config = _config;
		createServer();
	}

	/**
	 * @name createServer
	 */
	function createServer () {
		udpServer.on('error', (err) => {
			Logger.log(err, Logger.logTypes.error);
		});

		udpServer.on('message', (msg, rinfo) => {
			Logger.log(rinfo, Logger.logTypes.debug);
			Logger.log(msg, Logger.logTypes.debug);
		});

		udpServer.on('listening', () => {
			Logger.log(`UDP Socket listening on port ${config.port}.`, Logger.logTypes.debug);
		});

		udpServer.on('close', () => {
			Logger.log(`UDP Socket listening on port ${config.port} is not closed.`, Logger.logTypes.debug);
		});

		udpServer.bind(config.port);
	};

	return {
		init: init
	};
};

module.exports = JSDNS();
