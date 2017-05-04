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
function OPCodes () {
	/**
	 * @name OPCODES
	 * @access public
	 * @const
	 *
	 * @description This is an array of all operation codes in the form of objects with 2 properties. value and description.
	 */
	let OPCODES = [
		{
			'value': 0,
			'description': 'a standard query (QUERY)'
		},
		{
			'value': 1,
			'description': 'an inverse query (IQUERY)'
		},
		{
			'value': 2,
			'description': 'a server status request (STATUS)'
		}
		// 3-15 are reserved for future use per RFC 1035.
	];

	/**
	 * @name findOPCodeByValue
	 * @function
	 * @param {number} value The numeric value of the response code to search by.
	 *
	 * @returns {object} returns the response code associated with the value passed into the function. If no match is found null is returned.
	 */
	function findOPCodeByValue (value) {
		for (var i = 0; i < OPCODES.length; i++) {
			if (OPCODES[i].value === value) {
				return OPCODES[i];
			}
		}

		return null;
	};

	return {
		OPCODES: OPCODES,
		findOPCodeByValue: findOPCodeByValue
	};
}

module.exports = new OPCodes();
