/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 *
 * Implemented from RFC 1035 3.2.2 TYPE values and 3.2.3 QTYPE values
 */

/**
 * @name Types
 * @class
 *
 * @description This class contains all valid types and qtypes and search functions
 */
function Types () {
	/**
	 * @name TYPES
	 * @access public
	 * @const
	 *
	 * @description This is an array of all types and qtypes in the form of objects with 4 properties. value, name, description, isQType.
	 */
	let TYPES = [
		// TYPE values
		{
			'value': 1,
			'name': 'A',
			'description': '//A host address',
			'isQType': false
		},
		{
			'value': 2,
			'name': 'NS',
			'description': 'an authoritative name server',
			'isQType': false
		},
		{
			'value': 3,
			'name': 'MD',
			'description': 'a mail destination (Obsolete - use MX)',
			'isQType': false
		},
		{
			'value': 4,
			'name': 'MF',
			'description': 'a mail forwarder (Obsolete - use MX)',
			'isQType': false
		},
		{
			'value': 5,
			'name': 'CNAME',
			'description': 'the canonical name for an alias',
			'isQType': false
		},
		{
			'value': 6,
			'name': 'SOA',
			'description': 'marks the start of a zone of authority',
			'isQType': false
		},
		{
			'value': 7,
			'name': 'MB',
			'description': 'a mailbox domain name (EXPERIMENTAL)',
			'isQType': false
		},
		{
			'value': 8,
			'name': 'MG',
			'description': 'a mail group member (EXPERIMENTAL)',
			'isQType': false
		},
		{
			'value': 9,
			'name': 'MR',
			'description': 'a mail rename domain name (EXPERIMENTAL)',
			'isQType': false
		},
		{
			'value': 10,
			'name': 'NULL',
			'description': 'a null RR (EXPERIMENTAL)',
			'isQType': false
		},
		{
			'value': 11,
			'name': 'WKS',
			'description': 'a well known service description',
			'isQType': false
		},
		{
			'value': 12,
			'name': 'PTR',
			'description': 'a domain name pointer',
			'isQType': false
		},
		{
			'value': 13,
			'name': 'HINFO',
			'description': 'host information',
			'isQType': false
		},
		{
			'value': 14,
			'name': 'MINFO',
			'description': 'mailbox or mail list information',
			'isQType': false
		},
		{
			'value': 15,
			'name': 'MX',
			'description': 'mail exchange',
			'isQType': false
		},
		{
			'value': 16,
			'name': 'TXT',
			'description': 'text strings',
			'isQType': false
		},
    // QTYPE values
		{
			'value': 252,
			'name': 'AXFR',
			'description': 'A request for a transfer of an entire zone',
			'isQType': true
		},
		{
			'value': 253,
			'name': 'MAILB',
			'description': 'A request for mailbox-related records (MB, MG or MR)',
			'isQType': true
		},
		{
			'value': 254,
			'name': 'MAILA',
			'description': 'A request for mail agent RRs (Obsolete - see MX)',
			'isQType': true
		},
		{
			'value': 255,
			'name': '*',
			'description': 'A request for all records',
			'isQType': true
		}
	];

	/**
	 * @name findTypeByValue
	 * @function
	 * @param {number} value The numeric value of the type or qtype to search by.
	 *
	 * @returns {object} returns the type or qtype associated with the value passed into the function. If no match is found null is returned.
	 */
	function findTypeByValue (value) {
		for (var i = 0; i < TYPES.length; i++) {
			if (TYPES[i].value === value) {
				return TYPES[i];
			}
		}

		return null;
	};

	/**
	 * @name findTypeByName
	 * @function
	 * @param {string} name The string name of the type or qtype to search by.
	 *
	 * @returns {object} returns the type or qtype associated with the name passed into the function. If no match is found null is returned.
	 */
	function findTypeByName (name) {
		for (var i = 0; i < TYPES.length; i++) {
			if (TYPES[i].name === name) {
				return TYPES[i];
			}
		}

		return null;
	};

	return {
		TYPES: TYPES,
		findTypeByName: findTypeByName,
		findTypeByValue: findTypeByValue
	};
};

module.exports = new Types();
