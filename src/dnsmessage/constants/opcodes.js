/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 *
 * Implemented from RFC 1035 4.1.1 OPCODE values
 */

/**
 * @name OPCodes
 * @class
 *
 * @description This class contains all operation  codes and search functions
 */
class OPCodes {
	/**
	 * @name findOPCodeByValue
	 * @function
	 * @param {number} value The numeric value of the response code to search by.
	 *
	 * @returns {object} returns the response code associated with the value passed into the function. If no match is found null is returned.
	 */
	static findOPCodeByValue (value) {
		return OPCodes.CODES.find(o => o.value === value);
	}
}

/**
	 * @name OPCODES
	 * @access public
	 * @static
	 * @const
	 *
	 * @description This is an array of all operation codes in the form of objects with 2 properties. value and description.
	 */
Object.defineProperty(OPCodes, 'CODES', {
	value: [
		{
			'name': 'QUERY',
			'value': 0,
			'description': 'a standard query (QUERY)'
		},
		{
			'name': 'IQUERY',
			'value': 1,
			'description': 'an inverse query (IQUERY)'
		},
		{
			'name': 'STATUS',
			'value': 2,
			'description': 'a server status request (STATUS)'
		}
		// 3-15 are reserved for future use per RFC 1035.
	],
	writable: false,
	enumerable: true,
	configurable: false
});

module.exports = OPCodes;
