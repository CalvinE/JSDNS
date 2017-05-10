/*
 * Created on Sun May 07 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let Types = require('../../dnsmessage/constants/types');

/**
 * @name MemoryCacheProvider
 * @access public
 * @class
 *
 * @description
 */
function MemoryCacheProvider () { // TODO: Need to improve this by sorting cache on insert and then perhapse do binary search on cache?
	/**
	 * @name _cache
	 * @access private
	 *
	 * @description This is the array that contains the resource records that are cached.
	 */
	let _cache = [];

	/**
	 * @name wildCardQTypeValue
	 * @access private
	 *
	 * @description This is the value of the qType that is the wildcard selector.
	 */
	let wildCardQTypeValue = Types.findTypeByName('*').value;

	/**
	 * @name cache
	 * @access public
	 * @function
	 *
	 * @description This function caches a resource record for faster retrieval next time.
	 *
	 * @param {DNSMessage} dnsResponse
	 */
	function cache (dnsResponse) {
		let answers = dnsResponse.getAnswers();
		for (let i = 0; i < answers.length; i++) { // TODO: handle other parts of queries...
			_cache.push(answers[i]);
		}
	};

	/**
	 * @name search
	 * @access public
	 * @function
	 *
	 * @description This function searches the cache for a resource record.
	 *
	 * @param {DNSQuestion} dnsQuestion This is a DNS query that we will search for in the cache.
	 *
	 * @returns {DNSResourceRecord} The corresponding resource record for the query or if no match is found null is returned.
	 */
	function search (dnsQuestion) {
		let responses = [];
		let qNameRegex = new RegExp('^' + dnsQuestion.getQname() + '$', 'gi');
		let queryType = dnsQuestion.getQtype().value;
		let queryClass = dnsQuestion.getQclass().value;
		let counter = 0;
		while (counter < _cache.length) {
			let response = _cache[counter];
			let resourceName = response.getName();
			let resourceType = response.getType().value;
			let resourceClass = response.getRRclass().value;
		// _cache[i].getName() === queryName && _cache[i].getType().value === queryType && _cache[i].getClass().value === queryClass
			if (qNameRegex.test(resourceName) === true) {
				if (queryClass === resourceClass) {
					if (queryType === wildCardQTypeValue || queryType === resourceType) {
						if (response.isExpired() === true) {
							_cache.splice(counter, 1);
							counter--;
						} else {
							responses.push(response);
						}
					}
				}
			}
			counter++;
		}

		if (responses.length === 0) {
			responses = null;
		}

		return responses;
	};

	return {
		cache: cache,
		search: search
	};
};

module.exports = MemoryCacheProvider;
