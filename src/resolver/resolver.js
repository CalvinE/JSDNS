/*
 * Created on Fri May 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let DNSMessage = require('../dnsmessage/dnsmessage');
const dgram = require('dgram');

/**
 * @name Resolver
 * @class
 * @access public
 *
 * @description This class is the resolver. It handles resolving queries via local zone look up, cache lookup, recursive queries, or query forwarding based on the config passed in.
 */
function Resolver () {
	let config = null;

	let cache = null;

	let forwarders = [];

	/**
	 * @name resolve
	 * @access public
	 * @function
	 *
	 * @description This function resolves the query based on the configuration settings. The first set is to check the cache, then the local zone files, then if recursion is available we recursively query until we get our answer, otherwise we forward the query to any configured forwarding servers.
	 *
	 * @param {DNSMessage} query This is the query we are attempting to resolve.
	 *
	 * @returns {DNSMessage} The DNS Message response.
	 */
	function resolve (query) {
		var response = null;
		// 1. Query cache.
		response = cache.find(query);

		if (response === null) { // 2. Query local zone files.

		}

		if (response === null && config.recursion.recursionAvailable === true) { // If recursion is available then recursively resolve the query.

		} else if (response === null && config.forwarding.enabled === true) { // Else if forwarding is enabled forward the request to the configured forwarders.
			let client = dgram.createSocket('udp4');
			client.on('listening', function () {
				var address = client.address();
				console.log('UDP Server listening on ' + address.address + ':' + address.port);
			});

			client.on('message', function (message, remote) {
				console.log(remote.address + ':' + remote.port + ' - ' + message);
			});

			client.send(Buffer.from([44, 93, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 103, 105, 116, 104, 117, 98, 3, 99, 111, 109, 0, 0, 28, 0, 1]), 53, forwarders[0], (err) => {
				console.log(arguments);
			});
		}

		if (response === null) {
			response = new DNSMessage();
		}

		// return response;
	};

	/**
	 * @name init
	 * @access public
	 * @function
	 *
	 * @description This function initializes the resolver and get it ready to resolve.
	 *
	 * @param {Object} _config This parameter is the configuration for the resolver.
 	 * @param {Object} _cache This parameter is the cacheing object to be used by this resolver. I wanted to pass it in incase we wanted multiple resolvers and they needed to share caches.
	 */
	function init (_config = config, _cache = cache) {
		config = _config;
		cache = _cache;

		if (config.recursion.recursionAvailable === true) { // Cache local root server file.

		}

		if (config.forwarding.enabled === true) {
			forwarders = [];
			for (let i = 0; i < config.forwarding.forwarders.length; i++) {
				forwarders.push(config.forwarding.forwarders[i]);
			}
		}
	}

	/**
	 * @name setConfig
	 * @access public
	 * @function
	 *
	 * @description This function sets the configuration for the resolver.
	 *
	 * @param {Object} _config This parameter is the configuration for the resolver.
	 */
	function setConfig (_config) {
		init(_config, cache);
	};

	/**
	 * @name setConfig
	 * @access public
	 * @function
	 *
	 * @description This function sets the cache for the resolver.
	 *
	 * @param {Object} _cache This parameter is the cache for the resolver.
	 */
	function setCache (_cache) {
		init(config, _cache);
	}

	return {
		resolve: resolve,
		init: init,
		setConfig: setConfig,
		setCache: setCache
	};
};

module.exports = Resolver;
