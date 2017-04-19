/*
 * Created on Sat Feb 18 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const fs = require("fs");

/**
 * @name FSLogger
 * @type {class}
 * @access public
 * 
 * @description A utility class for logging information to the file system frommthe DNS server.
 */
FSLogger = function(){

    /**
     * @name loggerDir
     * @type {String}
     * @access private
     * 
     * @description This is the directory the log files from the server will be made.
     */
    let loggerDir = "./"

    /**
     * @name requestCounter
     * @type {Number}
     * @access private
     * 
     * @description This is just an auto incrementing counter for each item logged.
     */
    let requestCounter = 0;

    /**
     * @name setLoggerDir
     * @type {Function}
     * @access public
     * 
     * @description This function is the setter methog for the variable that represents the logging directory for the server.
     * 
     * @param {String} dir The path that log files should be created in.
     */
    function setLoggerDir(dir){
        loggerDir = dir;
    }

    /**
     * @name logDNSMessage
     * @type {Function}
     * @access public
     * 
     * @description This function will log the raw bytes of a DNS message to the server.
     * 
     * @param {Uint8Array | Buffer} data The complete DNS message in the form of a byte array or buffer. to be logged.
     */
    function logRawDNSMessage(data){

    }

    return {
        setLoggerDir: setLoggerDir
    }
};

module.exports = FSLogger;