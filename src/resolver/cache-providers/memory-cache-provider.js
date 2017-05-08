/*
 * Created on Sun May 07 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

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

		let queryName = dnsQuestion.getQname();

		for (let i = 0; i < _cache.length; i++) {
			if (_cache[i].getName() === queryName) {
				responses.push(_cache[i]);
			}
		}

		if (responses.length === 0) {
			responses = null;
		}

		return responses;
	}

	return {
		cache: cache,
		search: search
	};
};

module.exports = MemoryCacheProvider;
