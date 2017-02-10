/*
 * Created on Thu Feb 09 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

function Utilities() {

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
    function isNullOrUndefined(value){
        return ((value == null) || (value == undefined))
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
    function encode16BitValue(value){
        let highByte = (value >> 8) & 0xFF;
        let lowByte = value & 0xFF
        return [highByte, lowByte];
    }

    /**
     * @name decodeArcount
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
    function decode16BitValue(highByte, lowByte){
        //Sanitize the bytes to ensure they are 8 bit values.
        highByte = highByte & 0xFF;
        lowByte = lowByte & 0xFF;
        return ((highByte << 8) | lowByte);
    }

    return{
        isNullOrUndefined: isNullOrUndefined,
        encode16BitValue: encode16BitValue,
        decode16BitValue: decode16BitValue
    }

};



module.exports = Utilities();
