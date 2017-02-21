/*
 * Created on Sun Feb 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */


const TYPES = require("../dnsmessage/constants/qtypes");
const CLASSES = require("../dnsmessage/constants/qclasses");
const DNSUtils = require("../dnsmessage/dnsutilities");
const Utilities = require("../utilities");

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
     * @type {String}
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
     * @type {Number}
     * 
     * @description a 32 bit signed integer that specifies the time interval that the resource record may be cached before the source of the information should again be consulted. Zero values are interpreted to mean that the RR can only be used for the transaction in progress, and should not be cached. For example, SOA records are always distributed with a zero TTL to prohibit caching. Zero values can also be used for extremely volatile data.
     */
    let ttl = null;

    /**
     * @name rdLength
     * @access private
     * @type {Number}
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
     * @type {Number}
     * 
     * @description This is the absolute position in the byte array where this resource record begins.
     */
    let resourceRecordStartIndex = null;
    
    /**
     * @name resourceRecordLength
     * @access private
     * @type {Number}
     * 
     * @description This is the length of the resource record in bytes.
     */
    let resourceRecordength = null;

    /**
     * @name index
     * @access private
     * @type {Number}
     * 
     * @description This variable is used to keep track of the current index as we parse the resource record data.
     */
    let index = 0;

    /**
     * @name getName
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return name.
     * 
     * @returns {String} The current value of the name variable.
     */
    function getName(){
        return name;
    }

    /**
     * @name setName
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for name.
     * 
     * @param {String} _name A string of labels delimited by a . character.
     */
    function setName(_name){
        name = _name;
    }

    /**
     * @name decodeName
     * @access private
     * @type {Function}
     * 
     * @description Decodes the domain name from the resourceRecord data. Also it advances the index variable to keep track of how to parse the message.
     * 
     * @param {String} nameBytes This is the array of bytes that represent the entire DNS message.
     */
    function decodeName(nameBytes){
        let nameData = DNSUtils.decodeName(nameBytes, index);
        index = nameData.indexPosPostReading;
        return nameData.name.join(".");
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
     * @param {Object | Number} _type An object representing the Type from the QTypes module.
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
     * @param {Object | Number} _rclass An object representing the Class from the Classes module.
     */
    function setRRclass(_rclass){
        if(_rclass.value == undefined){
            _rclass = CLASSES.find(function(item){
                return item.value == parseInt(_rclass);
            });
        }
        rrClass = _rclass;
    }

    /**
     * @name getTtl
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return ttl.
     * 
     * @returns {Number} The current value of the ttl variable.
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
     * @param {Number} _ttl An object representing the ttl.
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
     * @param {Number} byte1 High word high byte of the 32 bits representing the ttl in the resource record.
     * @param {Number} byte2 High word low byte of the 32 bits representing the ttl in the resource record.
     * @param {Number} byte3 Low word high byte of the 32 bits representing the ttl in the resource record.
     * @param {Number} byte4 Low word low byte of the 32 bits representing the ttl in the resource record.
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
     * @returns {Number} The current value of the rdLength variable.
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
     * @param {Number} _rdLength An object representing the RDataLength.
     */
    function setRDLength(_rdLength){
        rdLength = _rdLength;
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
     * @param {Array} data
     * 
     * @returns {any} Whatever the RR data is.
     */
    function decodeRdata(data){
        let rrtypeValue = getType().value;
        let rdata = null;
        switch(rrtypeValue){
            case 1: //A record
                rdata = decodeARecordRData(data);
                break;
            case 2: //NS Record
                throw "NS Records not implemented yet."
                break;
            case 5: //CNAME Record
                throw "CNAME Records not implemented yet."
                break;
            case 6: //SOA Record
                throw "SOA Records not implemented yet."
                break;
            case 11: //WKS Record
                throw "WKS Records not implemented yet."
                break;
            case 12: //PTR Record
                throw "PTR Records not implemented yet."
                break;
            case 13: //HINFO Record
                throw "HINFO Records not implemented yet."
                break;
            case 14: //MINFO Record
                throw "MINFO Records not implemented yet."
                break;
            case 15: //MX Record
                throw "MX Records not implemented yet."
                break;
            case 16: //TXT Record
                throw "TXT Records not implemented yet."
                break;
        }
        return rdata;
    }

    /**
     * @name decodeARecordRData
     * @access public
     * @type {Function}
     * 
     * @description Decodes the rData from an A type resource record.
     * 
     * @param {Array} data
     */
    function decodeARecordRData(data){
        let totalLength = index + getRDLength();
        let hostAddress = [];
        while(index < totalLength){
            hostAddress.push(data[index++].toString());
        }
        return hostAddress.join(".");
    }

    /**
     * @name encodeRdata
     * @access public
     * @type {Function}
     * 
     * @description Decodes the rData from the resource record data.
     * 
     * @param {any} data The RData in what ever format is comes in.
     * 
     * @returns {Array} An array of bytes representing the encoded form of the data.
     */
    function encodeRdata(data){
        let rrtypeValue = getType().value;
        let rdata = null;
        switch(rrtypeValue){
            case 1: //A record
                rdata = encodeARecordRData(data);
                break;
            case 2: //NS Record
                throw "NS Records not implemented yet."
                break;
            case 5: //CNAME Record
                throw "CNAME Records not implemented yet."
                break;
            case 6: //SOA Record
                throw "SOA Records not implemented yet."
                break;
            case 11: //WKS Record
                throw "WKS Records not implemented yet."
                break;
            case 12: //PTR Record
                throw "PTR Records not implemented yet."
                break;
            case 13: //HINFO Record
                throw "HINFO Records not implemented yet."
                break;
            case 14: //MINFO Record
                throw "MINFO Records not implemented yet."
                break;
            case 15: //MX Record
                throw "MX Records not implemented yet."
                break;
            case 16: //TXT Record
                throw "TXT Records not implemented yet."
                break;
        }
        return rdata;
    }

    /**
     * @name encodeARecordRData
     * @access public
     * @type {Function}
     * 
     * @description Decodes the rData from an A type resource record.
     * 
     * @param {String} data The 32 bit host address as a tring delimited with periods.
     * 
     * @returns {Array} Array of bytes representing the 32 bit host address with the MSB in the 0 index of the array.
     */
    function encodeARecordRData(data){
        let result = [];
        data.split('.').forEach(function(octet) {
            result.push(octet & 0xFF);
        }, this);
        return result;
    }

    /**
     * @name getResourceRecordStartIndex
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return resource recordStartIndex.
     * 
     * @returns {Number} The current value of the resource recordStartIndex variable.
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
     * @param {Number} index An integer representing the starting index of this resource record relative to the whole message.
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
     * @returns {Number} The current value of the resourceRecordLength variable.
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
     * @param {Number} length An the length of this message as a part of the whole DNS message.
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
     * @param {Uint8Array} data This is an array containing the bytes of the complete DNS message.
     * @param {Number} offset This is an integer representing the offset to be used for parsing the resource record data.
     */
    function decodeDNSResourceRecordFromMessage(data, offset){
        index = offset;
        setResourceRecordStartIndex(index);
        setName(decodeName(data));
        setType(Utilities.decode16BitValue(data[index++], data[index++]));
        setRRclass(Utilities.decode16BitValue(data[index++], data[index++]));
        setTtl(decodeTtl(data[index++], data[index++], data[index++], data[index++]));
        setRDLength(Utilities.decode16BitValue(data[index++], data[index++]));
        setRData(decodeRdata(data));
        setResourceRecordLength(index-offset);
    }

    /**
     * @name encodeResourceRecordForMessage
     * @access public
     * @type {Function}
     * 
     * @description Encodes a dns resource record into a Uint8Array based on either the properties set on the variables of this class or from the object passed into the function. If a property is missing from the object then this function will attempt to use the getter function for that property, and if both are absent an error will be thrown.
     * 
     * @param {Object} dnsResourceRecordInfo An object with properties with the same names as the private variables used in this class.
     * @param {Number} startIndex The starting index of this resource record in the overall message.
     * 
     * @returns {Uint8Array} An array of bytes representing the DNS Resource Record.
     */
    function encodeResourceRecordForMessage(dnsResourceRecordInfo, startIndex){
        dnsResourceRecordInfo = dnsResourceRecordInfo || {};
        setName(Utilities.isNullOrUndefined(dnsResourceRecordInfo.name) ? getName() : dnsResourceRecordInfo.name);
        setType(Utilities.isNullOrUndefined(dnsResourceRecordInfo.type) ? getType() : dnsResourceRecordInfo.type);
        setRRclass(Utilities.isNullOrUndefined(dnsResourceRecordInfo.rrclass) ? getRRclass() : dnsResourceRecordInfo.rrclass);
        setTtl(Utilities.isNullOrUndefined(dnsResourceRecordInfo.ttl) ? getTtl() : dnsResourceRecordInfo.ttl);
        setRDLength(Utilities.isNullOrUndefined(dnsResourceRecordInfo.rdlength) ? getRDLength() : dnsResourceRecordInfo.rdlength)
        setRData(Utilities.isNullOrUndefined(dnsResourceRecordInfo.rdata) ? getRData() : dnsResourceRecordInfo.rdata)

        let tempBuffer = [];
        let rrLength = 0;
        let offset = 0;
        let name = DNSUtils.encodeName(getName());
        rrLength += name.length;
        let type = Utilities.encode16BitValue(getType().value);
        rrLength += type.length;
        let rrclass = Utilities.encode16BitValue(getRRclass().value);
        rrLength += rrclass.length;
        let ttl = Utilities.encode32BitValue(getTtl());
        rrLength += ttl.length;
        let rdlength = Utilities.encode16BitValue(getRDLength());
        rrLength += rdlength.length;
        let rdata = encodeRdata(getRData());
        rrLength += rdata.length

        let rrBuffer = new Uint8Array(rrLength);

        rrBuffer.set(name, offset);
        offset += name.length;
        rrBuffer.set(type, offset);
        offset += type.length;
        rrBuffer.set(rrclass, offset);
        offset += rrclass.length;
        rrBuffer.set(ttl, offset);
        offset += ttl.length;
        rrBuffer.set(rdlength, offset);
        offset += rdlength.length;
        rrBuffer.set(rdata, offset);
        offset += rdata.length;

        setResourceRecordLength(rrBuffer.length);
        setResourceRecordStartIndex(startIndex);

        return rrBuffer;
    }

    return{
        getName: getName,
        setName: setName,
        getType: getType,
        setType: setType,
        getRRclass: getRRclass,
        setRRclass: setRRclass,
        getTtl: getTtl,
        setTtl: setTtl,
        getRDLength: getRDLength,
        setRDLength: setRDLength,
        getRData: getRData,
        setRData: setRData, 
        getResourceRecordLength: getResourceRecordLength,
        getResourceRecordStartIndex: getResourceRecordStartIndex,
        decodeDNSResourceRecordFromMessage: decodeDNSResourceRecordFromMessage,
        encodeResourceRecordForMessage: encodeResourceRecordForMessage
    };

}

module.exports = DNSResourceRecord;