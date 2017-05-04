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
function RCodes () {
	/**
	 * @name RESPONSE_CODES
	 * @access public
	 * @const
	 *
	 * @description This is an array of all response codes in the form of objects with 3 properties. value, title, description.
	 */
	let RESPONSE_CODES = [
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
	];

	/**
	 * @name findRCodeByValue
	 * @function
	 * @param {number} value The numeric value of the response code to search by.
	 *
	 * @returns {object} returns the response code associated with the value passed into the function. If no match is found null is returned.
	 */
	function findRCodeByValue (value) {
		for (var i = 0; i < RESPONSE_CODES.length; i++) {
			if (RESPONSE_CODES[i].value === value) {
				return RESPONSE_CODES[i];
			}
		}

		return null;
	};

	return {
		RESPONSE_CODES: RESPONSE_CODES,
		findRCodeByValue: findRCodeByValue
	};
}
module.exports = new RCodes();
