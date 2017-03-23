/*
 * Created on Thu Feb 09 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */
"use strict";
var Utilities = (function () {
    function Utilities() {
    }
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
    Utilities.prototype.isNullOrUndefined = function (value) {
        return ((value == null) || (value == undefined));
    };
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
    Utilities.prototype.encode16BitValue = function (value) {
        var highByte = (value >> 8) & 0xFF;
        var lowByte = value & 0xFF;
        return [highByte, lowByte];
    };
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
    Utilities.prototype.decode16BitValue = function (highByte, lowByte) {
        //Sanitize the bytes to ensure they are 8 bit values.
        highByte = highByte & 0xFF;
        lowByte = lowByte & 0xFF;
        return ((highByte << 8) | lowByte);
    };
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
    Utilities.prototype.encode32BitValue = function (value) {
        var highHighByte = (value >> 24) & 0xFF;
        var highLowByte = (value >> 16) & 0xFF;
        var lowHighByte = (value >> 8) & 0xFF;
        var lowLowByte = value & 0xFF;
        return [highHighByte, highLowByte, lowHighByte, lowLowByte];
    };
    /**
     * @name decode32BitValue
     * @access private
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
    Utilities.prototype.decode32BitValue = function (highHighByte, highLowByte, lowHighByte, lowLowByte) {
        //Sanitize the bytes to ensure they are 8 bit values.
        highHighByte = highHighByte & 0xFF;
        highLowByte = highLowByte & 0xFF;
        lowHighByte = lowHighByte & 0xFF;
        lowLowByte = lowLowByte & 0xFF;
        //Just a note on the >>> 0 on the end of this line...
        //it is hacky, but it is the only way I can get this shift operation to be non negative!
        //The zero-fill right shift operator (>>>) is the only javascript operator that works with 32 bit unsigned integer, 
        //so using it at the end even with a value of 0 will cast the value to a 32 unsigned integer
        return ((highHighByte << 24) | (highLowByte << 16) | (lowHighByte << 8) | lowLowByte) >>> 0;
    };
    return Utilities;
}());
module.exports = new Utilities();
