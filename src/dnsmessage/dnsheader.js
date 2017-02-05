/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const OPCODES = require("../dnsmessage/constants/opcodes");
const RCODES = require("../dnsmessage/constants/rcodes");

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
     */
    function decodeQdcount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
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
     * @description description
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
        //We do not deoce the Z value because it is always 0 per RFC 1035 4.1.1
        setRcode(decodeRcode(flagLowByte));  
        setQdcount(decodeQdcount(data[index++], data[index++]));
        setAncount(decodeAncount(data[index++], data[index++]));
        setNscount(decodeNscount(data[index++], data[index++]));
        setArcount(decodeArcount(data[index++], data[index++]));
        setHeaderLength(index);
    }

    function encodeHeaderForMessage(){

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
        setZ: setZ,
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
        generateRandomID: generateRandomID
    };

}

module.exports = DNSMesageHeader;