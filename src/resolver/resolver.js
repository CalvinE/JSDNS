/*
 * Created on Fri May 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let RCodes = require('../dnsmessage/constants/rcodes');
let ResolverUtilities = require('./resolver-utilities');

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

	let recursionAvailable = 0;

	let maxRecursionAttempts = 0;

	let forwarders = [];

	/**
	 * @name resolve
	 * @access public
	 * @function
	 *
	 * @description This is the main resolution method in the resolver. It handles handing the incomming query off to the appropriate handler.
	 *
	 * @param {DNSMessage} dnsQuery The complete DNS Message to query for.
	 *
	 * @returns {Promise} A promise that is working on completeing your query. a reject from this query indicates a server error otherwise the resolve method will contain any other dns message result.
	 */
	function resolve (dnsQuery) {
		return new Promise(function (resolve, reject) {
			let opcode = dnsQuery.header.opcode.value;
			switch (opcode) {
			case 0:
				resolve(resolveStandardQuery(dnsQuery));
				break;
			case 1:
				resolve(resolveInverseQuery(dnsQuery));
				break;
			case 2:
				resolve(resolveStatusQuery(dnsQuery));
				break;
			default: // OPCODE is not a recognized value, so we return a query format error code?
				return Promise.resolve(dnsQuery.setMessageAsResponse(0, 0, recursionAvailable, RCodes.RESPONSE_CODES[1].value));
			};
		});
	};

	/**
	 * @name resolveStandardQuery
	 * @access private
	 * @function
	 *
	 * @description This is the method for resolving standard queries. For recursive resolution this method is called recursivly.
	 *
	 * @param {DNSMessage} dnsQuery
	 * @param {String} fullDomainName
	 *
	 * @return {DNSMessage} A response to your query.
	 */
	function resolveStandardQuery (dnsQuery, fullQNamePartsReversed = null, recursiveIteration = 0, recursiveServerAddress = null) { // TODO: Think about this last parameter... may need to re think this... could make this an array of DNSMessages that are in the order they were received?
		let recursionDesired = dnsQuery.header.rd;
		let question = dnsQuery.questions[0];
		// Step 1 search cache.
		let cacheSearchResults = standardSearchCache(question);
		if (cacheSearchResults === null) {
			// Step 2 search zone files.
			let zoneSearchResults = standardSearchZoneFiles(question);
			if (zoneSearchResults === null) {
				if (recursionAvailable === 1 && recursionDesired === 1 && recursiveIteration <= maxRecursionAttempts) {
					// Step 3 recursivly search.
					let recursionQName = '';
					if (fullQNamePartsReversed === null) {
						fullQNamePartsReversed = question.qname.split('.').reverse();
					}
					let noMoreRecursion = recursiveIteration >= fullQNamePartsReversed.length;
					if (noMoreRecursion === false) {
						// Still working through the domain name labels so we will need to query to see the name server for the current recursionQName.
						for (let i = 0; i <= recursiveIteration; i++) {
							recursionQName = fullQNamePartsReversed[i] + '.' + recursionQName;
						}
						// if (recursionQName.endsWith('.') === false) { // Be sure to add out trailing . to signify the root!
						// 	recursionQName += '.';
						// }
						recursiveIteration++;
					} else {
						// At the end of the query lables, so we do our final query. This is our exit condition!
					}
				} else if (config.forwarding.enabled === true) {
					// Step 3 forward query.
				} else {
					// No answer found.
				}
			}
		}
	};

	/**
	 * @name handleCNameResponse
	 * @access private
	 * @function
	 */
	function handleCNameResponse () {

	};

	/**
	 * @name handleNSResponse
	 * @access private
	 * @function
	 */
	function handleNSResponse () {

	};

	function standardSearchZoneFiles (question) {
		return null;
	};

	function standardSearchCache (question) {
		return null;
	};

	function isMatchingRecord (question) {
		return false;
	};

	/**
	 * @name resolveInverseQuery
	 * @access private
	 * @function
	 *
	 * @description This is the method for resolving inverse queries
	 *
	 * @param {DNSMessage} dnsQuery
	 *
	 * @return {DNSMessage} A response to your query.
	 */
	function resolveInverseQuery (dnsQuery) { // This returns the query with the RCode set to "Not implemented" because it is not yet implmented in this software.
		return ResolverUtilities.setMessageAsResponse(dnsQuery, 0, 0, recursionAvailable, RCodes.RESPONSE_CODES[4].value);
	};

	/**
	 * @name resolveStatusQuery
	 * @access private
	 * @function
	 *
	 * @description This is the method for resolving status queries
	 *
	 * @param {DNSMessage} dnsQuery
	 *
	 * @return {DNSMessage} A response to your query.
	 */
	function resolveStatusQuery (dnsQuery) { // This returns the query with the RCode set to "Not implemented" because it is not yet implmented in this software.
		return ResolverUtilities.setMessageAsResponse(dnsQuery, 0, 0, recursionAvailable, RCodes.RESPONSE_CODES[4].value);
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
			ResolverUtilities.sendDNSUDPDatagram(queryBuffer, forwarders[0]).then(function (response) {
				resolve(response);
			}, function (err) {
				reject(err);
			});
		});
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

		handleConfigUpdate();
	};

	/**
	 * @name updateConfig
	 * @access public
	 * @function
	 *
	 * @description This function updates the configuration for the resolver.
	 *
	 * @param {Object} _config This parameter is the configuration for the resolver.
	 */
	function updateConfig (_config) {
		config = _config;
		handleConfigUpdate();
	};

	function handleConfigUpdate () {
		recursionAvailable = (config.recursion.recursionAvailable === true) ? 1 : 0;
		maxRecursionAttempts = config.recursion.maxRecursionAttempts;
		if (recursionAvailable === 1) { // Cache local root server file.

		} else {

		}

		forwarders = [];
		for (let i = 0; i < config.forwarding.forwarders.length; i++) {
			forwarders.push(config.forwarding.forwarders[i]);
		}
	}

	/**
	 * @name updateCache
	 * @access public
	 * @function
	 *
	 * @description This function updates the cache for the resolver.
	 *
	 * @param {Object} _cache This parameter is the cache for the resolver.
	 */
	function updateCache (_cache) {
		cache = _cache;
	};

	return {
		resolve: resolve,
		init: init,
		updateConfig: updateConfig,
		updateCache: updateCache
	};
};

module.exports = Resolver;
