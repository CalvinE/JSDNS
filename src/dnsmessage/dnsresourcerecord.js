/*
 * Created on Sun Feb 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */


const TYPES = require("../dnsmessage/constants/qtypes");
const CLASSES = require("../dnsmessage/constants/qclasses");
const DNSUtils = require("../dnsmessage/dnsutilities");

/**
 * @name DNSResourceRecord
 * @class {DNSResourceRecord} DNSResourceRecord
 * @access public
 * 
 * @description A representation of a DNS message resource record (RR) and functions for encoding this data for reading and decoding this data for transmission.
 */
function DNSResourceRecord(){
    /**
     * @name name
     * @access private
     * @type {Array}
     * 
     * @description an owner name, i.e., the name of the node to which this resource record pertains.
     */
    let name = null;

    /**
     * @name type
     * @access private
     * @type {Object}
     * 
     * @description A two octet code which specifies the type of the resource record. The values for this field include all codes valid for a TYPE field, together with some more general codes which can match more than one type of RR.
     */
    let type = null;
    
    /**
     * @name rrClass
     * @access private
     * @type {Object}
     * 
     * @description A two octet code that specifies the class of the resource record. For example, the QCLASS field is IN for the Internet.
     */
    let rrClass = null;

    /**
     * @name ttl
     * @access private
     * @type {int}
     * 
     * @description a 32 bit signed integer that specifies the time interval that the resource record may be cached before the source of the information should again be consulted. Zero values are interpreted to mean that the RR can only be used for the transaction in progress, and should not be cached. For example, SOA records are always distributed with a zero TTL to prohibit caching. Zero values can also be used for extremely volatile data.
     */
    let ttl = null;

    /**
     * @name rdLength
     * @access private
     * @type {int}
     * 
     * @description an unsigned 16 bit integer that specifies the length in octets of the RDATA field.
     */
    let rdLength = null;

    /**
     * @name rData
     * @access private
     * @type {object}
     * 
     * @description a variable length string of octets that describes the resource. The format of this information varies according to the TYPE and CLASS of the resource record.
     */
    let rData = null;
    
    /**
     * @name resourceRecordStartIndex
     * @access private
     * @type {int}
     * 
     * @description This is the absolute position in the byte array where this resource record begins.
     */
    let resourceRecordStartIndex = null;
    
    /**
     * @name resourceRecordLength
     * @access private
     * @type {int}
     * 
     * @description This is the length of the resource record in bytes.
     */
    let resourceRecordength = null;

    /**
     * @name index
     * @access private
     * @type {int}
     * 
     * @description This variable is used to keep track of the current index as we parse the resource record data.
     */
    let index = 0;

    /**
     * @name getName
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qname.
     * 
     * @returns {array} The current value of the qname variable..
     */
    function getName(){
        return qname;
    }

    /**
     * @name setName
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qname.
     * 
     * @param {Array} _name An array of strings ("labels") representing the domain name of the resourceRecord.
     */
    function setQname(qname){
        name = _name;
    }

    /**
     * @name decodeQname
     * @access private
     * @type {Function}
     * 
     * @description Decodes the domain name from the resourceRecord data. Also it advances the index variable to keep track of how to parse the message.
     * 
     * @param {Array} nameBytes This is the array of bytes that represent the entire DNS message.
     */
    function decodeQname(nameBytes){
        let name = DNSUtils.decodeName(nameBytes, index);
        let length = nameBytes[index++];
        while(length != 0x00){            
            length = nameBytes[index++];
        }
        return name;
    }

    /**
     * @name getType
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qtype.
     * 
     * @returns {Object} The current value of the qtype variable.
     */
    function getType(){
        return type;
    }

    /**
     * @name setType
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for type.
     * 
     * @param {Object} _type An object representing the Type from the QTypes module.
     */
    function setType(_type){
        if(_type.value == undefined){
            _type = TYPES.find(function(item){
                return item.value == parseInt(_type);
            });
        }
        type = _type;
    }
    
    /**
     * @name decodeQtype
     * @access private
     * @type {Function}
     * 
     * @description Decodes the QType from the resource record data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the QType in the resource record.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the QType in the resource record.
     */
    function decodeType(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    /**
     * @name getRRclass
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return rrClass.
     * 
     * @returns {Object} The current value of the qclass variable.
     */
    function getRRclass(){
        return rrClass;
    }

    /**
     * @name setRRclass
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for rrClass.
     * 
     * @param {Object} _qclass An object representing the Class from the QClasses module.
     */
    function setRRclass(_qclass){
        if(_qclass.value == undefined){
            _qclass = CLASSES.find(function(item){
                return item.value == parseInt(_qclass);
            });
        }
        qclass = _qclass;
    }

    /**
     * @name decodeRRclass
     * @access private
     * @type {Function}
     * 
     * @description Decodes the Class from the resource record data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the Class in the resource record.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the Class in the resource record.
     */
    function decodeRRclass(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    /**
     * @name getTtl
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return ttl.
     * 
     * @returns {Object} The current value of the ttl variable.
     */
    function getTtl(){
        return ttl;
    }

    /**
     * @name setTtl
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for ttl.
     * 
     * @param {Object} _ttl An object representing the ttl.
     */
    function setTtl(_ttl){
        ttl = _ttl
    }

    /**
     * @name decodeTtl
     * @access private
     * @type {Function}
     * 
     * @description Decodes the Class from the resource record data.
     * 
     * @param {Uint8} byte1 High word high byte of the 32 bits representing the ttl in the resource record.
     * @param {Uint8} byte2 High word low byte of the 32 bits representing the ttl in the resource record.
     * @param {Uint8} byte3 Low word high byte of the 32 bits representing the ttl in the resource record.
     * @param {Uint8} byte4 Low word low byte of the 32 bits representing the ttl in the resource record.
     */
    function decodeTtl(byte1, byte2, byte3, byte4){
        return (byte1 << 24) | (byte2 << 16) | (byte3 << 16) |(byte4);
    }

    /**
     * @name getRDLength
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return rdLength.
     * 
     * @returns {int} The current value of the rdLength variable.
     */
    function getRDLength(){
        return rdLength;
    }

    /**
     * @name setRDLength
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for rdLength.
     * 
     * @param {int} _rdLength An object representing the RDataLength.
     */
    function setRDLength(_rdLength){
        rdLength = _rdLength;
    }

    /**
     * @name decodeRLength
     * @access private
     * @type {Function}
     * 
     * @description Decodes the RDataLength from the resource record data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the RDataLength in the resource record.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the RDataLength in the resource record.
     */
    function decodeRLength(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    /**
     * @name getRData
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return rData.
     * 
     * @returns {Object} The current value of the rData variable.
     */
    function getRData(){
        return rData;
    }

    /**
     * @name setRRclass
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for rData.
     * 
     * @param {Object} _rdata An object representing the rdata.
     */
    function setRData(_rdata){        
        rData = _rdata;
    }

    /**
     * @name decodeRdata
     * @access public
     * @type {Function}
     * 
     * @description Decodes the rData from the resource record data.
     * 
     * @param {array} data
     */
    function decodeRdata(data){
        throw "not implemented yet!";
    }

    /**
     * @name getResourceRecordStartIndex
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return resource recordStartIndex.
     * 
     * @returns {int} The current value of the resource recordStartIndex variable.
     */
    function getResourceRecordStartIndex(){
        return resourceRecordStartIndex;
    }

    /**
     * @name setResourceRecordStartIndex
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for resourceRecordStartIndex.
     * 
     * @param {int} index An integer representing the starting index of this resource record relative to the whole message.
     */
    function setResourceRecordStartIndex(index){
        resourceRecordStartIndex = index;
    }

    /**
     * @name getResourceRecordLength
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return resourceRecordLength.
     * 
     * @returns {int} The current value of the resourceRecordLength variable.
     */
    function getResourceRecordLength(){
        return resourceRecordLength;
    }

    /**
     * @name setResourceRecordLength
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for resourceRecordLength.
     * 
     * @param {int} length An the length of this message as a part of the whole DNS message.
     */
    function setResourceRecordLength(length){
        resourceRecordLength = length;
    }
    
    /**
     * @name decodeDNSResourceRecordFromMessage
     * @access public
     * @type {Function}
     * 
     * @description This function takes the byte array containing the DNS message and populates the model with the messages resource record data at the specified offset in the array.
     * 
     * @param {array} data This is an array containing the bytes of the complete DNS message.
     * @param {int} offset This is an integer representing the offset to be used for parsing the resource record data.
     */
    function decodeDNSResourceRecordFromMessage(data, offset){
        index = offset;
        setResourceRecordStartIndex(index);
        setQname(decodeName(data));
        setQtype(decodeType(data[index++], data[index++]));
        setQclass(decodeRRclass(data[index++], data[index++]));
        setResourceRecordLength(index-offset);
    }

    return{
        getQname: getQname,
        setQname: setQname,
        getType: getType,
        setType: setType,
        getClass: getClass,
        setClass: setClass,
        getTtl: getTtl,
        setTtl: setTtl,
        getRDLength: getRDLength,
        setRDLength: setRDLength,
        getRData: getRData,
        setRData: setRData, 
        getResourceRecordLength: getResourceRecordLength,
        getResourceRecordStartIndex: getResourceRecordStartIndex,
        decodeDNSResourceRecordFromMessage: decodeDNSResourceRecordFromMessage
    };

}

module.exports = DNSRecordResponses;