/*
 * Created on Fri May 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let DNSMessage = require('../dnsmessage/dnsmessage');
let Logger = require('../logging/logger');
let Utilities = require('../utilities');
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
	 * @returns {Promise} A promise that will have the result of the DNS query..
	 */
	function resolve (query) {
		return new Promise(function (resolve, reject) {
			try {
				// 1. Query cache.
				searchCache(query).then(function (cacheResponse) {
					if (cacheResponse === null) {
						zoneFileSearch(query).then(function (zoneResponse) {
							if (zoneResponse === null) {
								let step3 = null;
								let queryStream = query.encodeMessageToBuffer();
								if (zoneResponse === null && config.recursion.recursionAvailable === true) { // If recursion is available then recursively resolve the query.
									step3 = recurse(queryStream);
								} else if (zoneResponse === null && config.forwarding.enabled === true) { // Else if forwarding is enabled forward the request to the configured forwarders.
									step3 = forward(queryStream);
								}
								if (step3 !== null) {
									step3.then(function (step3Response) {
										if (step3Response === null) {
											handleQueryNotFound(query);
										} else {
											resolve(step3Response);
										}
									}, handlePromiseFailure);
								} else {
									handleQueryNotFound(query);
								}
							} else {
								resolve(zoneResponse);
							}
						}, handlePromiseFailure);
					} else {
						resolve(cacheResponse);
					}
				}, handlePromiseFailure);
			} catch (e) {
				reject(e);
			}
		});
	};

	/**
	 * @name searchCache
	 * @access private
	 * @function
	 *
	 * @description This is one of the three steps in the resolution process. This is the first step.
	 *
	 * @param {DNSMessage} query A DNSMesage object.
	 *
	 * @returns {Promise} The result of the cache.find function of the cache provider given to the resolver. The find method implementation needs to return a promise..
	 */
	function searchCache (query) {
		return cache.find(query);
	};

	/**
	 * @name forward
	 * @access private
	 * @function
	 *
	 * @description This is one of the three steps in the resolution process. This is the second step.
	 *
	 * @param {DNSMessage} query A DNSMesage object.
	 *
	 * @returns {Promise} A promise with the results from the zone file search.
	 */
	function zoneFileSearch (query) {
		return new Promise(function (resolve, reject) {
			resolve(null); // TODO: Implement this...
		});
	};

	/**
	 * @name recurse
	 * @access private
	 * @function
	 *
	 * @description This is one of the third steps in the resolution process. This only happens if recursion is disabled and forwarding is enabled.
	 *
	 * @param {Buffer} queryBuffer A buffer containing the raw byte stream of the dns request.
	 *
	 * @returns {Promise} A promise with the results from the forwarding.
	 */
	function recurse (query) {
		return new Promise(function (resolve, reject) {
			resolve(null); // TODO: Implement this...
		});
	};

	/**
	 * @name forward
	 * @access private
	 * @function
	 *
	 * @description This is one of the third steps in the resolution process. This only happens if recursion available is set and recursion is desired.
	 *
	 * @param {Buffer} queryBuffer A buffer containing the raw byte stream of the dns request.
	 *
	 * @returns {Promise} A promise with the results from the forwarding.
	 */
	function forward (queryBuffer) {
		return new Promise(function (resolve, reject) {
			let response = null;
			let client = dgram.createSocket('udp4');
			client.on('listening', function () {
				let address = client.address();
				console.log('UDP Server listening on ' + address.address + ':' + address.port);
			});

			client.on('message', function (message, remote) {
				console.log(remote.address + ':' + remote.port + ' - ' + message);
				try {
					response = new DNSMessage();
					response.parseRequest(message);
					resolve(response);
				} catch (e) {
					reject(e);
				}
			});

			client.send(Buffer.from(queryBuffer), 53, forwarders[0], (err) => { // TODO: implement this in a way that cycles through forwarders until either a result is found or we run out...
				if (Utilities.isNullOrUndefined(err) === false) {
					reject(err);
				}
			});
		});
	};

	/**
	 * @name handleQueryNotFound
	 * @access private
	 * @function
	 *
	 * @description This function handles when no corresponding resource records are found for a given query.
	 *
	 * @param {DNSMessage} query This is origional query that resulted in no results being found.
	 */
	function handleQueryNotFound (query) {
		Logger.log('no domain found!');
		// TODO: implement not found response...
	};

	/**
	 * @name handlePromiseFailure
	 * @access private
	 * @function
	 *
	 * @param {any} reason This is typically the error object passed back through the promise chain that caused the rejection.
	 */
	function handlePromiseFailure (reason) {
		Logger.logError(reason);
		// TODO: implement better error handling...
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
