/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const OPCODES = require("../dnsmessage/constants/opcodes");
const RCODES = require("../dnsmessage/constants/rcodes");
const Utilities = require("../utilities");

/**
 * @name DNSMesageHeader
 * @class {DNSMesageHeader} DNSMesageHeader
 * @access public
 * 
 * @description A representation of a DNS message header and functions for encoding this data for reading and decoding this data for transmission.
 */
function DNSMesageHeader(){
    /**
     * @name id
     * @access private
     * @type {int}
     * 
     * @description A 16 bit identifier assigned by the program that generates any kind of query.  This identifier is copied the corresponding reply and can be used by the requester to match up replies to outstanding queries.
     */
    let id = null;

    /**
     * @name qr
     * @access private
     * @type {int}
     * 
     * @description A one bit field that specifies whether this message is a query (0), or a response (1).
     */
    let qr = null; 

    /**
     * @name opcode
     * @access private
     * @type {Object}
     * 
     * @description A four bit field that specifies kind of query in this message.  This value is set by the originator of a query and copied into the response.
     */
    let opcode = null;

    /**
     * @name aa
     * @access private
     * @type {int}
     * 
     * @description Authoritative Answer - this bit is valid in responses, and specifies that the responding name server is an authority for the domain name in question section. Note that the contents of the answer section may have multiple owner names because of aliases.  The AA bitcorresponds to the name which matches the query name, or the first owner name in the answer section.
     */
    let aa = null;

    /**
     * @name tc
     * @access private
     * @type {int}
     * 
     * @description TrunCation - specifies that this message was truncated due to length greater than that permitted on the transmission channel.
     */
    let tc = null;

    /**
     * @name rd
     * @access private
     * @type {int}
     * 
     * @description Recursion Desired - this bit may be set in a query and is copied into the response.  If RD is set, it directs the name server to pursue the query recursively. Recursive query support is optional.
     */
    let rd = null;

    /**
     * @name ra
     * @access private
     * @type {int}
     * 
     * @description Recursion Available - this be is set or cleared in a response, and denotes whether recursive query support is available in the name server.
     */
    let ra = null;

    /**
     * @name z
     * @access private
     * @type {int}
     * 
     * @description Reserved for future use.  Must be zero in all queries and responses.
     */
    let z = 0;

    /**
     * @name rcode
     * @access private
     * @type {Object}
     * 
     * @description Response code - this 4 bit field is set as part of responses. 
     */
    let rcode = null;

    /**
     * @name qdcount
     * @access private
     * @type {int}
     * 
     * @description An unsigned 16 bit integer specifying the number of entries in the question section.
     */
    let qdcount = null;

    /**
     * @name ancount
     * @access private
     * @type {int}
     * 
     * @description An unsigned 16 bit integer specifying the number of resource records in the answer section.
     */
    let ancount = null;

    /**
     * @name nscount
     * @access private
     * @type {int}
     * 
     * @description An unsigned 16 bit integer specifying the number of name server resource records in the authority records section.
     */
    let nscount = null;

    /**
     * @name arcount
     * @access private
     * @type {int}
     * 
     * @description An unsigned 16 bit integer specifying the number of resource records in the additional records section.
     */
    let arcount = null;

    /**
     * @name headerLength
     * @access private
     * @type {int}
     * 
     * @description This is the length in bytes of the header.
     */
    let headerLength = null;

    /**
     * @name getId
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return id.
     * 
     * @returns {int} The current value of the id variable.
     */
    function getId(){
        return id;
    }

    /**
     * @name setId
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for id.
     * 
     * @param {int} _id An integer to store as the ID of the DNS message.
     */
    function setId(_id){
        if(_id === null){
            throw "DNS Header id cannot be null";
        }
        id = _id;
    }

    /**
     * @name decodeId
     * @access private
     * @type {Function}
     * 
     * @description Decodes the id value from the header data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the id in the header.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the id in the header.
     */
    function decodeId(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    /**
     * @name encodeId
     * @access private
     * @type {Function}
     * 
     * @description Encodes the id of the header into an array of 2 bytes with the high byte being in index 0.
     * 
     * @param {int} _id The dns header id.
     * 
     * @returns {Array} An array of bytes representing the dns header id with the high byte being at index 0.
     */
    function encodeId(_id){
        let highByte = ((_id & 0xFF00) >> 8);
        let lowByte = ((_id & 0xFF));
        return [highByte, lowByte];
    }

    /**
     * @name getQr
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qr.
     * 
     * @returns {int} The current value of the qr variable.
     */
    function getQr(){
        return qr;
    }

    /**
     * @name setQr
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qr.
     * 
     * @param {Object} _qr A value representing whether this is a query or a response. 0 is query 1 is response.
     */
    function setQr(_qr){
        if(_qr === null){
            throw "DNS Header qr cannot be null";
        }
        qr = _qr;
    }
    
    /**
     * @name decodeQr
     * @access private
     * @type {Function}
     * 
     * @description Decodes the qr value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeQr(byte){
        return (byte & 0x80) != 0x00 ? 0x01 : 0x00
    }

    /**
     * @name getOpcode
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return opcode.
     * 
     * @returns {Object} The current value of the opcode variable.
     */
    function getOpcode(){
        return opcode;
    }

    /**
     * @name setOpcode
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for opcode.
     * 
     * @param {Object} _opcode An object representing the Opcode from the Opcodes module.
     */
    function setOpcode(_opcode){
        if(_opcode === null){
            throw "DNS Header opcode cannot be null";
        }
        if(_opcode.value == undefined){
            _opcode = OPCODES.find(function(item){
                return item.value == parseInt(_opcode);
            });
        }
        opcode = _opcode;
    }

    /**
     * @name decodeOpcode
     * @access private
     * @type {Function}
     * 
     * @description Decodes the opcode value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeOpcode(byte){
        return ((byte & 0x78) << 3);
    }

    /**
     * @name getAa
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return aa.
     * 
     * @returns {int} The current value of the aa variable..
     */
    function getAa(){
        return aa;
    }

    /**
     * @name setAa
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for aa.
     * 
     * @param {int} _aa A value representing if the responding DNS server is an authority for the domain name in question 1 is true 0 is false;
     */
    function setAa(_aa){
        if(_aa === null){
            throw "DNS Header aa cannot be null";
        }
        aa = _aa;
    }

    /**
     * @name decodeAa
     * @access private
     * @type {Function}
     * 
     * @description Decodes the aa value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeAa(byte){
        return (byte & 0x04) != 0x00 ? 0x01 : 0x00
    }

    /**
     * @name getTc
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return tc.
     * 
     * @returns {int} A value representing if the mesage was truncated bue to length 1 is true 0 is false.
     */
    function getTc(){
        return tc;
    }

    /**
     * @name setTc
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for tc.
     * 
     * @param {int} _tc An object representing the QType from the QTypes module.
     */
    function setTc(_tc){
        if(_tc === null){
            throw "DNS Header tc cannot be null";
        }
        tc = _tc;
    }

    /**
     * @name decodeTc
     * @access private
     * @type {Function}
     * 
     * @description Decodes the tc value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeTc(byte){
        return (byte & 0x02) != 0x00 ? 0x01 : 0x00
    }

    /**
     * @name getRd
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return rd.
     * 
     * @returns {int} The current value of the rd variable.
     */
    function getRd(){
        return rd;
    }

    /**
     * @name setRd
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for rd.
     * 
     * @param {Object} _rd An integer representing is recursion is desired 1 is true 0 is false.
     */
    function setRd(_rd){
        if(_rd === null){
            throw "DNS Header rd cannot be null";
        }
        rd = _rd;
    }

    /**
     * @name decodeRd
     * @access private
     * @type {Function}
     * 
     * @description Decodes the rd value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeRd(byte){
        return (byte & 0x01) != 0x00 ? 0x01 : 0x00
    }

    /**
     * @name getRa
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return ra.
     * 
     * @returns {int} The current value of the ra variable.
     */
    function getRa(){
        return ra;
    }

    /**
     * @name setQtype
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qtype.
     * 
     * @param {int} _ra An integer representing is recursion is available 1 is true 0 is false.
     */
    function setRa(_ra){
        if(_ra === null){
            throw "DNS Header ra cannot be null";
        }
        ra = _ra;
    }

    /**
     * @name decodeRa
     * @access private
     * @type {Function}
     * 
     * @description Decodes the ra value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeRa(byte){
        return (byte & 0x80) != 0x00 ? 0x01 : 0x00
    }

    /**
     * @name getZ
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return z.
     * 
     * @returns {int} The current value of the z variable.
     */
    function getZ(){
        return z;
    }

    /**
     * @name setZ
     * @access public
     * @type {Function}
     * 
     * @description DO NOT USE THIS METHOD!!!!! z must always be zero per RFC 1035. This is the setter method for z.
     * 
     * @param {int} _z sets the value of the z variable.
     */
    function setZ(_z){
        z = _z;
        throw "z cannot be set. it must always be 0 per RFC 1035";
    }

    /**
     * @name getRcode
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return rcode.
     * 
     * @returns {Object} The current value of the rcode variable.
     */
    function getRcode(){
        return rcode;
    }

    /**
     * @name setRcode
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for rcode.
     * 
     * @param {Object} _rcode An object representing the RCode from the RCodes module.
     */
    function setRcode(_rcode){
        if(_rcode === null){
            throw "DNS Header rcode cannot be null";
        }
        if(_rcode.value == undefined){
            _rcode = RCODES.find(function(item){
                return item.value == parseInt(_rcode);
            });
        }
        rcode = _rcode;
    }

    /**
     * @name decodeRcode
     * @access private
     * @type {Function}
     * 
     * @description Decodes the rcode value from the header data.
     * 
     * @param {Uint8} byte
     */
    function decodeRcode(byte){
        return 0x0F & byte;
    }

    /**
     * @name encodeFlagBytes
     * @access private
     * @type {Function}
     * 
     * @description Encodes the values of the following dns header properties in two bytes that represent the flag bytes for the dns header.
     * 
     * @param {int} _qr the qr value for the header.
     * @param {int} _opcode the opcode value for the header.
     * @param {int} _aa the aa value for the header.
     * @param {int} _tc the tc value for the header.
     * @param {int} _rd the rd value for the header.
     * @param {int} _ra the ra value for the header.
     * @param {int} _z the z value for the header.
     * @param {int} _rcode the rcode value for the header.
     * 
     * @returns {Array} An array of bytes representing the dns header flag bytes with the high byte being at index 0.
     */
    function encodeFlagBytes(_qr, _opcode, _aa, _tc, _rd, _ra, _z, _rcode){
        //get your bits in a row :-)
        let flagValue = (((_qr << 15) | (_opcode << 11) | (_aa << 10) | (_tc << 9) | (_rd << 8) | (_ra << 7) | (_z << 4) | (_rcode << 11)) & 0xFFFF);
        return [((flagValue >> 8)), (flagValue & 0xFF)];
    }

    /**
     * @name getQdcount
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qdcount.
     * 
     * @returns {int} The current value of the qdcount variable..
     */
    function getQdcount(){
        return qdcount;
    }

    /**
     * @name setQdcount
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qdcount.
     * 
     * @param {Object} _qdcount The number of questions for the DNS message.
     */
    function setQdcount(_qdcount){
        if(_qdcount === null){
            throw "DNS Header qdcount cannot be null";
        }
        qdcount = _qdcount
    }

    /**
     * @name decodeQdcount
     * @access private
     * @type {Function}
     * 
     * @description Decodes the question count value from the header data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the qdcount in the header.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the qdcount in the header.
     * 
     * @returns {int} A 16 bit number representing the number of questions associated with this dns message.
     */
    function decodeQdcount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    /**
     * @name encodeQdcount
     * @access private
     * @type {Function}
     * 
     * @description Encodes the qdcount variable into an array of two bytes with the high byte in the 0 index.
     * 
     * @param {int} _qdcount The number of questions in the message.
     * 
     * @returns {Array} Array of two bytes with the high byte in the 0 index.
     */
    function encodeQdcount(_qdcount){
        let highByte = (_qdcount >> 8);
        let lowByte = _qdcount & 0xFF
        return [highByte, lowByte];
    }

    /**
     * @name getAncount
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return ancount.
     * 
     * @returns {int} The current value of the ancount variable..
     */
    function getAncount(){
        return ancount;
    }

    /**
     * @name setAncount
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for ancount.
     * 
     * @param {Object} _ancount The number of answer records for the DNS message.
     */
    function setAncount(_ancount){
        if(_ancount === null){
            throw "DNS Header ancount cannot be null";
        }
        ancount = _ancount
    }

    /**
     * @name decodeAncount
     * @access private
     * @type {Function}
     * 
     * @description Decodes the answer count value from the header data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the ancount in the header.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the ancount in the header.
     */
    function decodeAncount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    /**
     * @name encodeAncount
     * @access private
     * @type {Function}
     * 
     * @description Encodes the ancount variable into an array of two bytes with the high byte in the 0 index.
     * 
     * @param {int} _ancount The number of answers in the message.
     * 
     * @returns {Array} Array of two bytes with the high byte in the 0 index.
     */
    function encodeAncount(_ancount){
        let highByte = (_ancount >> 8) & 0xFF;
        let lowByte = _ancount & 0xFF
        return [highByte, lowByte];
    }

    /**
     * @name getNscount
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return nscount.
     * 
     * @returns {int} The current value of the nscount variable..
     */
    function getNscount(){
        return nscount;
    }

    /**
     * @name setNscount
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for nscount.
     * 
     * @param {int} _nscount The number of nameserver records for the DNS message.
     */
    function setNscount(_nscount){
        if(_nscount === null){
            throw "DNS Header nscount cannot be null";
        }
        nscount = _nscount;
    }

    /**
     * @name decodeNscount
     * @access private
     * @type {Function}
     * 
     * @description Decodes the nameserver count value from the header data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the nscount in the header.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the nscount in the header.
     */
    function decodeNscount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    /**
     * @name encodeNscount
     * @access private
     * @type {Function}
     * 
     * @description Encodes the nscount variable into an array of two bytes with the high byte in the 0 index.
     * 
     * @param {int} _nscount The number of name servers in the message.
     * 
     * @returns {Array} Array of two bytes with the high byte in the 0 index.
     */
    function encodeNscount(_nscount){
        let highByte = (_nscount >> 8) & 0xFF;
        let lowByte = _nscount & 0xFF
        return [highByte, lowByte];
    }

    /**
     * @name getArcount
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return arcount.
     * 
     * @returns {int} The current value of the arcount variable..
     */
    function getArcount(){
        return arcount;
    }

    /**
     * @name setArcount
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for arcount.
     * 
     * @param {int} _arcount The number of additional records for the DNS message.
     */
    function setArcount(_arcount){
        if(_arcount === null){
            throw "DNS Header arcount cannot be null";
        }
        arcount = _arcount;
    }

    /**
     * @name decodeArcount
     * @access private
     * @type {Function}
     * 
     * @description Decodes the additional record count value from the header data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the arcount in the header.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the arcount in the header.
     */
    function decodeArcount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    /**
     * @name encodeArcount
     * @access private
     * @type {Function}
     * 
     * @description Encodes the arcount variable into an array of two bytes with the high byte in the 0 index.
     * 
     * @param {int} _arcount The number of additional records in the message.
     * 
     * @returns {Array} Array of two bytes with the high byte in the 0 index.
     */
    function encodeArcount(_arcount){
        let highByte = (_arcount >> 8) & 0xFF;
        let lowByte = _arcount & 0xFF
        return [highByte, lowByte];
    }

    /**
     * @name getHeaderLength
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return headerLength.
     * 
     * @returns {int} The current value of the headerLength variable..
     */
    function getHeaderLength(){
        return headerLength;
    }
    
    /**
     * @name setHeaderLength
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for headerLength.
     * 
     * @param {int} length The length of the header for the DNS message. (Per RFC 1035 this could always be 12)
     */
    function setHeaderLength(length){
        headerLength = length;
    }

    /**
     * @name decodeDNSHeaderFromMessage
     * @access public
     * @type {Function}
     * 
     * @description This function takes the byte array containing the DNS message and populates the model with the messages header data.
     * 
     * @param {array} data This is an array containing the bytes of the complete DNS message.
     */
    function decodeDNSHeaderFromMessage(data){
        let index = 0;
        setId(decodeId(data[index++], data[index++]));
        let flagHighByte = data[index++];
        let flagLowByte = data[index++];
        setQr(decodeQr(flagHighByte));
        setOpcode(decodeOpcode(flagHighByte));
        setAa(decodeAa(flagHighByte));
        setTc(decodeTc(flagHighByte));
        setRd(decodeRd(flagHighByte));
        setRa(decodeRa(flagLowByte));      
        //We do not decode the Z value because it is always 0 per RFC 1035 4.1.1
        setRcode(decodeRcode(flagLowByte));  
        setQdcount(decodeQdcount(data[index++], data[index++]));
        setAncount(decodeAncount(data[index++], data[index++]));
        setNscount(decodeNscount(data[index++], data[index++]));
        setArcount(decodeArcount(data[index++], data[index++]));
        setHeaderLength(index);
    }

    /**
     * @name encodeHeaderForMessage
     * @access public
     * @type {Function}
     * 
     * @description Encodes a dns header into a Uint8Array based on either the properties set on the variables of this class or from the object passed into the function. If a property is missing from the object then this function will attempt to use the getter function for that property, and if both are absent an error will be thrown.
     * 
     * @param {Object} dnsHeaderInfo An object with properties with the same names as the private variables used in this class.
     * 
     * @returns {Uint8Array} An array of bytes representing the DNS Header.
     */
    function encodeHeaderForMessage(dnsHeaderInfo){
        dnsHeaderInfo = dnsHeaderInfo || {};
        let _id = Utilities.isNullOrUndefined(dnsHeaderInfo.id) ? getId() : dnsHeaderInfo.id;
        if(Utilities.isNullOrUndefined(_id)){
            _id = generateRandomID();
        }
        setId(_id);
        setQr(Utilities.isNullOrUndefined(dnsHeaderInfo.qr) ? getQr() : dnsHeaderInfo.qr);
        setOpcode(Utilities.isNullOrUndefined(dnsHeaderInfo.opcode) ? getOpcode() : dnsHeaderInfo.opcode);
        setAa(Utilities.isNullOrUndefined(dnsHeaderInfo.aa) ? getAa() : dnsHeaderInfo.aa);
        setTc(Utilities.isNullOrUndefined(dnsHeaderInfo.tc) ? getTc() : dnsHeaderInfo.tc);
        setRd(Utilities.isNullOrUndefined(dnsHeaderInfo.rd) ? getRd() : dnsHeaderInfo.rd);
        setRa(Utilities.isNullOrUndefined(dnsHeaderInfo.ra) ? getRa() : dnsHeaderInfo.ra);
        let _z = 0x00; //Z value because it is always 0 per RFC 1035 4.1.1
        setRcode(Utilities.isNullOrUndefined(dnsHeaderInfo.rcode) ? getRcode() : dnsHeaderInfo.rcode)
        setQdcount(Utilities.isNullOrUndefined(dnsHeaderInfo.qdcount) ? getQdcount() : dnsHeaderInfo.qdcount);
        setAncount(Utilities.isNullOrUndefined(dnsHeaderInfo.ancount) ? getAncount() : dnsHeaderInfo.ancount);
        setNscount(Utilities.isNullOrUndefined(dnsHeaderInfo.nscount) ? getNscount() : dnsHeaderInfo.nscount);
        setArcount(Utilities.isNullOrUndefined(dnsHeaderInfo.arcount) ? getArcount() : dnsHeaderInfo.arcount);

        let headerBuffer = new Uint8Array(12);
        let idBytes = encodeId(getId());
        let offset = 0;
        headerBuffer.set(idBytes, offset);
        offset += idBytes.length;
        let flagBytes = encodeFlagBytes(getQr(), getOpcode().value, getAa(), getTc(), getRd(), getRa(), getZ(), getRcode().value);
        headerBuffer.set(flagBytes, offset);
        offset += flagBytes.length;
        let qdBytes = encodeQdcount(getQdcount());
        headerBuffer.set(qdBytes, offset);
        offset += qdBytes.length;
        let anBytes = encodeAncount(getAncount());
        headerBuffer.set(anBytes, offset);
        offset += anBytes.length;
        let nsBytes = encodeNscount(getNscount());
        headerBuffer.set(nsBytes, offset);
        offset += nsBytes.length;
        let arBytes = encodeArcount(getArcount());
        headerBuffer.set(arBytes, offset);
        offset += arBytes.length;
        setHeaderLength(offset);
    }

    function generateRandomID(){
        return Math.floor(Math.random() * (0xFFFF - 0x00)) + 0x00;
    }

    return{
        getId: getId,
        setId: setId,
        getQr: getQr,
        setQr: setQr,
        getOpcode: getOpcode,
        setOpcode: setOpcode,
        getAa: getAa,
        setAa: setAa,
        getTc: getTc,
        setTc: setTc,
        getRd: getRd,
        setRd: setRd,
        getRa: getRa,
        setRa: setRa,
        getZ: getZ,
        // setZ: setZ,
        getRcode: getRcode,
        setRcode: setRcode,
        getQdcount: getQdcount,
        setQdcount: setQdcount,
        getAncount: getAncount,
        setAncount: setAncount,
        getNscount: getNscount,
        setNscount: setNscount,
        getArcount: getArcount,
        setArcount: setArcount,
        getHeaderLength: getHeaderLength,
        decodeDNSHeaderFromMessage: decodeDNSHeaderFromMessage,
        encodeHeaderForMessage: encodeHeaderForMessage,
        generateRandomID: generateRandomID
    };

}

module.exports = DNSMesageHeader;