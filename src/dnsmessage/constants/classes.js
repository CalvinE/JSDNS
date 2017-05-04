/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 *
 * Implemented from RFC 1035 3.2.4 CLASS values and 3.2.5 QCLASS values
 */

/**
 * @name Classes
 * @class
 *
 * @description This class contains all valid classes and qclasses and search functions
 */
function Classes () {
	/**
	 * @name CLASSES
	 * @access public
	 * @const
	 *
	 * @description This is an array of all classes and qclasses in the form of objects with 4 properties. value, name, description, and isQClass.
	 */
	let CLASSES = [
    // CLASS values
		{
			'value': 1,
			'name': 'IN',
			'description': 'the Internet',
			'isQClass': false
		},
		{
			'value': 2,
			'name': 'CS',
			'description': 'the CSNET class (Obsolete - used only for examples in some obsolete RFCs)',
			'isQClass': false
		},
		{
			'value': 3,
			'name': 'CH',
			'description': 'the CHAOS class',
			'isQClass': false
		},
		{
			'value': 4,
			'name': 'HS',
			'description': 'Hesiod [Dyer 87]',
			'isQClass': false
		},
		// QCLASS values
		{
			'value': 255,
			'name': '*',
			'description': 'any class',
			'isQClass': true
		}
	];

	/**
	 * @name findClassByValue
	 * @function
	 * @param {number} value The numeric value of the class or qclass to search by.
	 *
	 * @returns {object} returns the class or qclass associated with the value passed into the function. If no match is found null is returned.
	 */
	function findClassByValue (value) {
		for (var i = 0; i < CLASSES.length; i++) {
			if (CLASSES[i].value === value) {
				return CLASSES[i];
			}
		}

		return null;
	};

	/**
	 * @name findClassByName
	 * @function
	 * @param {string} name The string name of the class or qclass to search by.
	 *
	 * @returns {object} returns the class or qclass associated with the name passed into the function. If no match is found null is returned.
	 */
	function findClassByName (name) {
		for (var i = 0; i < CLASSES.length; i++) {
			if (CLASSES[i].name === name) {
				return CLASSES[i];
			}
		}

		return null;
	};

	return {
		CLASSES: CLASSES,
		findClassByName: findClassByName,
		findClassByValue: findClassByValue
	};
};
module.exports = new Classes();
