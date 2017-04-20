/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const OPCODES = require('../dnsmessage/constants/opcodes');
const RCODES = require('../dnsmessage/constants/rcodes');
const Utilities = require('../utilities');
const ErrorFactory = require('../logging/error');

/**
 * @name DNSMesageHeader
 * @class {DNSMesageHeader} DNSMesageHeader
 * @access public
 *
 * @description A representation of a DNS message header and functions for encoding this data for reading and decoding this data for transmission.
 */
function DNSMesageHeader () {
    /**
     * @name id
     * @access private
     * @type {Number}
     *
     * @description A 16 bit identifier assigned by the program that generates any kind of query.  This identifier is copied the corresponding reply and can be used by the requester to match up replies to outstanding queries.
     */
	let id = null;

    /**
     * @name qr
     * @access private
     * @type {Number}
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
     * @type {Number}
     *
     * @description Authoritative Answer - this bit is valid in responses, and specifies that the responding name server is an authority for the domain name in question section. Note that the contents of the answer section may have multiple owner names because of aliases.  The AA bitcorresponds to the name which matches the query name, or the first owner name in the answer section.
     */
	let aa = null;

    /**
     * @name tc
     * @access private
     * @type {Number}
     *
     * @description TrunCation - specifies that this message was truncated due to length greater than that permitted on the transmission channel.
     */
	let tc = null;

    /**
     * @name rd
     * @access private
     * @type {Number}
     *
     * @description Recursion Desired - this bit may be set in a query and is copied into the response.  If RD is set, it directs the name server to pursue the query recursively. Recursive query support is optional.
     */
	let rd = null;

    /**
     * @name ra
     * @access private
     * @type {Number}
     *
     * @description Recursion Available - this be is set or cleared in a response, and denotes whether recursive query support is available in the name server.
     */
	let ra = null;

    /**
     * @name z
     * @access private
     * @type {Number}
     *
     * @description Reserved for future use. Must be zero in all queries and responses.
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
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of entries in the question section.
     */
	let qdcount = null;

    /**
     * @name ancount
     * @access private
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of resource records in the answer section.
     */
	let ancount = null;

    /**
     * @name nscount
     * @access private
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of name server resource records in the authority records section.
     */
	let nscount = null;

    /**
     * @name arcount
     * @access private
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of resource records in the additional records section.
     */
	let arcount = null;

    /**
     * @name headerLength
     * @access private
     * @type {Number}
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
     * @returns {Number} The current value of the id variable.
     */
	function getId () {
		return id;
	}

    /**
     * @name setId
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for id.
     *
     * @param {Number} _id An integer to store as the ID of the DNS message.
     */
	function setId (_id) {
		if (_id === null) {
			throw ErrorFactory('DNS Header id cannot be null', null);
		}
		id = _id;
	}

    /**
     * @name getQr
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return qr.
     *
     * @returns {Number} The current value of the qr variable.
     */
	function getQr () {
		return qr;
	}

    /**
     * @name setQr
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qr.
     *
     * @param {Number} _qr A value representing whether this is a query or a response. 0 is query 1 is response.
     */
	function setQr (_qr) {
		if (_qr === null) {
			throw ErrorFactory('DNS Header qr cannot be null', null);
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
     * @param {Number} byte
     */
	function decodeQr (byte) {
		return (byte & 0x80) !== 0x00 ? 0x01 : 0x00;
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
	function getOpcode () {
		return opcode;
	}

    /**
     * @name setOpcode
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for opcode.
     *
     * @param {Object | Number} _opcode An object representing the Opcode from the Opcodes module.
     */
	function setOpcode (_opcode) {
		if (_opcode === null) {
			throw ErrorFactory('DNS Header opcode cannot be null', null);
		}
		if (_opcode.value === undefined) {
			_opcode = OPCODES.find(function (item) {
				return item.value === parseInt(_opcode);
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
     * @param {Number} byte
     */
	function decodeOpcode (byte) {
		return ((byte & 0x78) << 3);
	}

    /**
     * @name getAa
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return aa.
     *
     * @returns {Number} The current value of the aa variable..
     */
	function getAa () {
		return aa;
	}

    /**
     * @name setAa
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for aa.
     *
     * @param {Number} _aa A value representing if the responding DNS server is an authority for the domain name in question 1 is true 0 is false;
     */
	function setAa (_aa) {
		if (_aa === null) {
			throw ErrorFactory('DNS Header aa cannot be null', null);
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
     * @param {Number} byte
     */
	function decodeAa (byte) {
		return (byte & 0x04) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name getTc
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return tc.
     *
     * @returns {Number} A value representing if the mesage was truncated bue to length 1 is true 0 is false.
     */
	function getTc () {
		return tc;
	}

    /**
     * @name setTc
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for tc.
     *
     * @param {Number} _tc An object representing the QType from the QTypes module.
     */
	function setTc (_tc) {
		if (_tc === null) {
			throw ErrorFactory('DNS Header tc cannot be null', null);
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
     * @param {Number} byte
     */
	function decodeTc (byte) {
		return (byte & 0x02) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name getRd
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return rd.
     *
     * @returns {Number} The current value of the rd variable.
     */
	function getRd () {
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
	function setRd (_rd) {
		if (_rd === null) {
			throw ErrorFactory('DNS Header rd cannot be null', null);
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
     * @param {Number} byte
     */
	function decodeRd (byte) {
		return (byte & 0x01) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name getRa
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return ra.
     *
     * @returns {Number} The current value of the ra variable.
     */
	function getRa () {
		return ra;
	}

    /**
     * @name setQtype
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qtype.
     *
     * @param {Number} _ra An integer representing is recursion is available 1 is true 0 is false.
     */
	function setRa (_ra) {
		if (_ra === null) {
			throw ErrorFactory('DNS Header ra cannot be null', null);
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
     * @param {Number} byte
     */
	function decodeRa (byte) {
		return (byte & 0x80) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name getZ
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return z.
     *
     * @returns {Number} The current value of the z variable.
     */
	function getZ () {
		return z;
	}

    /**
     * @name setZ
     * @access public
     * @type {Function}
     *
     * @description DO NOT USE THIS METHOD!!!!! z must always be zero per RFC 1035. This is the setter method for z.
     *
     * @param {Number} _z sets the value of the z variable.
     *
     * @todo delete this because unles spec changes this will never get used.
     */
	// function setZ (_z) {
	// 	z = _z;
	// 	throw ErrorFactory('z cannot be set. it must always be 0 per RFC 1035', null);
	// }

    /**
     * @name getRcode
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return rcode.
     *
     * @returns {Object} The current value of the rcode variable.
     */
	function getRcode () {
		return rcode;
	}

    /**
     * @name setRcode
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for rcode.
     *
     * @param {Object | Number} _rcode An object representing the RCode from the RCodes module.
     */
	function setRcode (_rcode) {
		if (_rcode === null) {
			throw ErrorFactory('DNS Header rcode cannot be null', null);
		}
		if (_rcode.value === undefined) {
			_rcode = RCODES.find(function (item) {
				return item.value === parseInt(_rcode);
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
     * @param {Number} byte
     */
	function decodeRcode (byte) {
		return 0x0F & byte;
	}

    /**
     * @name encodeFlagBytes
     * @access private
     * @type {Function}
     *
     * @description Encodes the values of the following dns header properties in two bytes that represent the flag bytes for the dns header.
     *
     * @param {Number} _qr the qr value for the header.
     * @param {Number} _opcode the opcode value for the header.
     * @param {Number} _aa the aa value for the header.
     * @param {Number} _tc the tc value for the header.
     * @param {Number} _rd the rd value for the header.
     * @param {Number} _ra the ra value for the header.
     * @param {Number} _z the z value for the header.
     * @param {Number} _rcode the rcode value for the header.
     *
     * @returns {Array} An array of bytes representing the dns header flag bytes with the high byte being at index 0.
     */
	function encodeFlagBytes (_qr, _opcode, _aa, _tc, _rd, _ra, _z, _rcode) {
        // get your bits in a row :-)
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
     * @returns {Number} The current value of the qdcount variable..
     */
	function getQdcount () {
		return qdcount;
	}

    /**
     * @name setQdcount
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qdcount.
     *
     * @param {Number} _qdcount The number of questions for the DNS message.
     */
	function setQdcount (_qdcount) {
		if (_qdcount === null) {
			throw ErrorFactory('DNS Header qdcount cannot be null', null);
		}
		qdcount = _qdcount;
	}

    /**
     * @name getAncount
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return ancount.
     *
     * @returns {Number} The current value of the ancount variable..
     */
	function getAncount () {
		return ancount;
	}

    /**
     * @name setAncount
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for ancount.
     *
     * @param {Number} _ancount The number of answer records for the DNS message.
     */
	function setAncount (_ancount) {
		if (_ancount === null) {
			throw ErrorFactory('DNS Header ancount cannot be null', null);
		}
		ancount = _ancount;
	}

    /**
     * @name getNscount
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return nscount.
     *
     * @returns {Number} The current value of the nscount variable..
     */
	function getNscount () {
		return nscount;
	}

    /**
     * @name setNscount
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for nscount.
     *
     * @param {Number} _nscount The number of nameserver records for the DNS message.
     */
	function setNscount (_nscount) {
		if (_nscount === null) {
			throw ErrorFactory('DNS Header nscount cannot be null', null);
		}
		nscount = _nscount;
	}

    /**
     * @name getArcount
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return arcount.
     *
     * @returns {Number} The current value of the arcount variable..
     */
	function getArcount () {
		return arcount;
	}

    /**
     * @name setArcount
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for arcount.
     *
     * @param {Number} _arcount The number of additional records for the DNS message.
     */
	function setArcount (_arcount) {
		if (_arcount === null) {
			throw ErrorFactory('DNS Header arcount cannot be null', null);
		}
		arcount = _arcount;
	}

    /**
     * @name getHeaderLength
     * @access public
     * @type {Function}
     *
     * @description This is the getter method to return headerLength.
     *
     * @returns {Number} The current value of the headerLength variable..
     */
	function getHeaderLength () {
		return headerLength;
	}

    /**
     * @name setHeaderLength
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for headerLength.
     *
     * @param {Number} length The length of the header for the DNS message. (Per RFC 1035 this could always be 12)
     */
	function setHeaderLength (length) {
		headerLength = length;
	}

    /**
     * @name decodeDNSHeaderFromMessage
     * @access public
     * @type {Function}
     *
     * @description This function takes the byte array containing the DNS message and populates the model with the messages header data.
     *
     * @param {Uint8Array} data This is an array containing the bytes of the complete DNS message.
     */
	function decodeDNSHeaderFromMessage (data) {
		let index = 0;
		setId(Utilities.decode16BitValue(data[index++], data[index++]));
		let flagHighByte = data[index++];
		let flagLowByte = data[index++];
		setQr(decodeQr(flagHighByte));
		setOpcode(decodeOpcode(flagHighByte));
		setAa(decodeAa(flagHighByte));
		setTc(decodeTc(flagHighByte));
		setRd(decodeRd(flagHighByte));
		setRa(decodeRa(flagLowByte));
        // We do not decode the Z value because it is always 0 per RFC 1035 4.1.1
		setRcode(decodeRcode(flagLowByte));
		setQdcount(Utilities.decode16BitValue(data[index++], data[index++]));
		setAncount(Utilities.decode16BitValue(data[index++], data[index++]));
		setNscount(Utilities.decode16BitValue(data[index++], data[index++]));
		setArcount(Utilities.decode16BitValue(data[index++], data[index++]));
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
	function encodeHeaderForMessage (dnsHeaderInfo) {
		dnsHeaderInfo = dnsHeaderInfo || {};
		let _id = Utilities.isNullOrUndefined(dnsHeaderInfo.id) ? getId() : dnsHeaderInfo.id;
		if (Utilities.isNullOrUndefined(_id)) {
			_id = generateRandomID();
		}
		setId(_id);
		setQr(Utilities.isNullOrUndefined(dnsHeaderInfo.qr) ? getQr() : dnsHeaderInfo.qr);
		setOpcode(Utilities.isNullOrUndefined(dnsHeaderInfo.opcode) ? getOpcode() : dnsHeaderInfo.opcode);
		setAa(Utilities.isNullOrUndefined(dnsHeaderInfo.aa) ? getAa() : dnsHeaderInfo.aa);
		setTc(Utilities.isNullOrUndefined(dnsHeaderInfo.tc) ? getTc() : dnsHeaderInfo.tc);
		setRd(Utilities.isNullOrUndefined(dnsHeaderInfo.rd) ? getRd() : dnsHeaderInfo.rd);
		setRa(Utilities.isNullOrUndefined(dnsHeaderInfo.ra) ? getRa() : dnsHeaderInfo.ra);
		// Z value because it is always 0 per RFC 1035 4.1.1
		setRcode(Utilities.isNullOrUndefined(dnsHeaderInfo.rcode) ? getRcode() : dnsHeaderInfo.rcode);
		setQdcount(Utilities.isNullOrUndefined(dnsHeaderInfo.qdcount) ? getQdcount() : dnsHeaderInfo.qdcount);
		setAncount(Utilities.isNullOrUndefined(dnsHeaderInfo.ancount) ? getAncount() : dnsHeaderInfo.ancount);
		setNscount(Utilities.isNullOrUndefined(dnsHeaderInfo.nscount) ? getNscount() : dnsHeaderInfo.nscount);
		setArcount(Utilities.isNullOrUndefined(dnsHeaderInfo.arcount) ? getArcount() : dnsHeaderInfo.arcount);

		let headerBuffer = new Uint8Array(12);
		let idBytes = Utilities.encode16BitValue(getId());
		let offset = 0;
		headerBuffer.set(idBytes, offset);
		offset += idBytes.length;
		let flagBytes = encodeFlagBytes(getQr(), getOpcode().value, getAa(), getTc(), getRd(), getRa(), getZ(), getRcode().value);
		headerBuffer.set(flagBytes, offset);
		offset += flagBytes.length;
		let qdBytes = Utilities.encode16BitValue(getQdcount());
		headerBuffer.set(qdBytes, offset);
		offset += qdBytes.length;
		let anBytes = Utilities.encode16BitValue(getAncount());
		headerBuffer.set(anBytes, offset);
		offset += anBytes.length;
		let nsBytes = Utilities.encode16BitValue(getNscount());
		headerBuffer.set(nsBytes, offset);
		offset += nsBytes.length;
		let arBytes = Utilities.encode16BitValue(getArcount());
		headerBuffer.set(arBytes, offset);
		offset += arBytes.length;
		setHeaderLength(headerBuffer.length);
	}

	function generateRandomID () {
		return Math.floor(Math.random() * (0xFFFF - 0x0001)) + 0x0001;
	}

	return {
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
