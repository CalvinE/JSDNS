/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

/**
 * @name RCodes
 * @class
 *
 * @description This class contains all response codes and search functions
 */
class RCodes {
	/**
	 * @name findRCodeByValue
	 * @function
	 * @public
	 * @static
	 * @param {number} value The numeric value of the response code to search by.
	 *
	 * @returns {object} returns the response code associated with the value passed into the function. If no match is found null is returned.
	 */
	static findRCodeByValue (value) {
		return RCodes.RESPONSE_CODES.find(r => r.value === value);
	}
}

Object.defineProperty(RCodes, 'RESPONSE_CODES', {
	value: [
		{
			'value': 0,
			'title': 'Success',
			'description': 'No error condition'
		},
		{
			'value': 1,
			'title': 'Format error',
			'description': 'The name server was unable to interpret the query.'
		},
		{
			'value': 2,
			'title': 'Server failure',
			'description': 'The name server was unable to process this query due to a problem with the name server.'
		},
		{
			'value': 3,
			'title': 'Name error',
			'description': 'Meaningful only for responses from an authoritative name server, this code signifies that the domain name referenced in the query does not exist.'
		},
		{
			'value': 4,
			'title': 'Not implemented',
			'description': 'The name server does not support the requested kind of query.'
		},
		{
			'value': 5,
			'title': 'Refused',
			'description': 'The name server refuses to perform the specified operation for policy reasons.  For example, a name server may not wish to provide the information to the particular requester, or a name server may not wish to perform a particular operation (e.g., zone transfer) for particular data.'
		}
		// 6-15 are reserved for future use per RFC 1035
	],
	writable: false,
	enumerable: true,
	configurable: false
});

module.exports = RCodes;
