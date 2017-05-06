/*
 * Created on Thu Feb 09 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

function Utilities () {
  /**
  * @name isNullOrUndefined
  * @access public
  * @type {Function}
  *
  * @description Checks a value to see if it is null or undefined.
  *
  * @param {any} value Any value to be tested.
  *
  * @returns {boolean} True if the input is null or undefined False if it is not.
  */
	function isNullOrUndefined (value) {
		return ((value === null) || (value === undefined));
	}

  /**
  * @name encode16BitValue
  * @access public
  * @type {Function}
  *
  * @description Encodes the input into an array of two bytes with the high byte in the 0 index.
  *
  * @param {Number} value The number to be encoded into an 8 bit byte array.
  *
  * @returns {Array} Array of two bytes with the high byte in the 0 index.
  */
	function encode16BitValue (value) {
		let highByte = (value >> 8) & 0xFF;
		let lowByte = value & 0xFF;
		return [highByte, lowByte];
	}

  /**
  * @name decode16BitValue
  * @access private
  * @type {Function}
  *
  * @description Decodes the input values into a 16 bit value.
  *
  * @param {Number} highByte High byte of the 16 bits representing the arcount in the header.
  * @param {Number} lowByte Low byte of the 16 bits representing the arcount in the header.
  *
  * @returns {Number} A 16 bit value assembled from the two input bytes.
  */
	function decode16BitValue (highByte, lowByte) {
    // Sanitize the bytes to ensure they are 8 bit values.
		highByte = highByte & 0xFF;
		lowByte = lowByte & 0xFF;
		return ((highByte << 8) | lowByte);
	}

  /**
  * @name encode32BitValue
  * @access public
  * @type {Function}
  *
  * @description Encodes the input into an array of two bytes with the high byte in the 0 index.
  *
  * @param {Number} value The number to be encoded into an 8 bit byte array.
  *
  * @returns {Array} Array of two bytes with the high byte in the 0 index.
  */
	function encode32BitValue (value) {
		let highHighByte = (value >> 24) & 0xFF;
		let highLowByte = (value >> 16) & 0xFF;
		let lowHighByte = (value >> 8) & 0xFF;
		let lowLowByte = value & 0xFF;
		return [highHighByte, highLowByte, lowHighByte, lowLowByte];
	}

  /**
  * @name decode32BitValue
  * @access public
  * @type {Function}
  *
  * @description Decodes the input values into a 32 bit value.
  *
  * @param {Number} highHighByte High byte of the high byte of the 32 bits representing the value.
  * @param {Number} highLowByte Low byte of the high byte of the 32 bits representing the value.
  * @param {Number} lowHighByte High byte of the low byte of the 32 bits representing the value.
  * @param {Number} lowLowByte Low byte of the low byte of the 32 bits representing the value.
  *
  * @returns {Number} A 32 bit value assembled from the four input bytes.
  */
	function decode32BitValue (highHighByte, highLowByte, lowHighByte, lowLowByte) {
    // Sanitize the bytes to ensure they are 8 bit values.
		highHighByte = highHighByte & 0xFF;
		highLowByte = highLowByte & 0xFF;
		lowHighByte = lowHighByte & 0xFF;
		lowLowByte = lowLowByte & 0xFF;
    // Just a note on the >>> 0 on the end of this line...
    // it is hacky, but it is the only way I can get this shift operation to be non negative!
    // The zero-fill right shift operator (>>>) is the only javascript operator that works with 32 bit unsigned integer,
    // so using it at the end even with a value of 0 will cast the value to a 32 unsigned integer
		return ((highHighByte << 24) | (highLowByte << 16) | (lowHighByte << 8) | lowLowByte) >>> 0;
	}

  /**
   * @name getUTCDateStringFileSafe
   * @access public
   * @type {Function}
   *
   * @description This function takes a date object and additional delimiter characters and creates a UTC date time string safe for use as a file name, unless you overried the delimiters with something that is not safe for a file name...
   *
   * @param {Date} date This is the date object that will be used for construction of the UTC date time string. By default it is just a new date instance.
   * @param {string} dateDelimiter This is a string that will be used as a delimiter for the date parts of the string. By default is it ''.
   * @param {string} dateTimeDelimiter This is a string that will be used as a delimiter for the date part and the time part of the string. By default is it '_'.
   * @param {string} timeDelimiter This is a string that will be used as a delimiter for the time parts of the string. By default is it ''.
   *
   * @returns {string} Returns a UTC date time string safe for use as a file name, unless you overried the delimiters with something that is not safe for a file name...
   */
	function getUTCDateStringFileSafe (date = new Date(), dateDelimiter = '', dateTimeDelimiter = '_', timeDelimiter = '') {
		let seconds = date.getUTCSeconds();
		let minutes = date.getUTCMinutes();
		let hours = date.getUTCHours();
		let month = date.getUTCMonth() + 1;
		let day = date.getUTCDate();
		seconds = (seconds < 10) ? '0' + seconds : seconds;
		minutes = (minutes < 10) ? '0' + minutes : minutes;
		hours = (hours < 10) ? '0' + hours : hours;
		month = (month < 10) ? '0' + month : month;
		day = (day < 10) ? '0' + day : day;
		return `${date.getUTCFullYear()}${dateDelimiter}${month}${dateDelimiter}${day}${dateTimeDelimiter}${hours}${timeDelimiter}${minutes}${timeDelimiter}${seconds}`;
	};

	return {
		isNullOrUndefined: isNullOrUndefined,
		encode16BitValue: encode16BitValue,
		decode16BitValue: decode16BitValue,
		encode32BitValue: encode32BitValue,
		decode32BitValue: decode32BitValue,
		getUTCDateStringFileSafe: getUTCDateStringFileSafe
	};
};

module.exports = Utilities();
