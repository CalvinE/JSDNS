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

    return{
        isNullOrUndefined: isNullOrUndefined
    }

};



module.exports = Utilities();
