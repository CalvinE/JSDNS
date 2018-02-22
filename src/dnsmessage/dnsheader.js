/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const OperationCodes = require('../dnsmessage/constants/opcodes');
const ResponseCodes = require('../dnsmessage/constants/rcodes');
const Utilities = require('../utilities');
const ErrorFactory = require('../error');

/**
 * @name DNSMesageHeader
 * @class {DNSMesageHeader} DNSMesageHeader
 * @access public
 *
 * @description A representation of a DNS message header and functions for encoding this data for reading and decoding this data for transmission.
 */
class DNSMesageHeader {
	DNSMesageHeader () {
		this._id = null;
		this._qr = null;
		this._opcode = null;
		this._aa = null;
		this._tc = null;
		this._rd = null;
		this._ra = null;
		// this._z = 0;
		this._qdcount = null;
		this._ancount = null;
		this._nscount = null;
		this._arcount = null;
		this._headerLength = null;
	}
    /**
     * @name id Getter
     * @access public
     * @type {Number}
     *
     * @description A 16 bit identifier assigned by the program that generates any kind of query.  This identifier is copied the corresponding reply and can be used by the requester to match up replies to outstanding queries.
     */
	get id () {
		return this._id;
	}

    /**
     * @name id Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for id.
     *
     * @param {Number} _i An integer to store as the ID of the DNS message.
     */
	set id (_i) {
		if (_i === null) {
			throw ErrorFactory('DNS Header id cannot be null', null);
		}
		this._id = _i;
	}

    /**
     * @name qr Getter
     * @access public
     * @type {Number}
     *
     * @description A one bit field that specifies whether this message is a query (0), or a response (1).
     */
	get qr () {
		return this._qr;
	}

    /**
     * @name qr Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qr.
     *
     * @param {Number} _q A value representing whether this is a query or a response. 0 is query 1 is response.
     */
	set qr (_q) {
		if (_q === null) {
			throw ErrorFactory('DNS Header qr cannot be null', null);
		}
		this._qr = _q;
	}

    /**
     * @name _decodeQr
     * @access private
     * @type {Function}
     *
     * @description Decodes the qr value from the header data.
     *
     * @param {Number} byte
     */
	_decodeQr (byte) {
		return (byte & 0x80) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name opcode
     * @access public
     * @type {Object}
     *
     * @description A four bit field that specifies kind of query in this message.  This value is set by the originator of a query and copied into the response.
     */
	get opcode () {
		return this._opcode;
	}

    /**
     * @name opcode Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for opcode.
     *
     * @param {Object | Number} _o An object representing the Opcode from the OperationCodes module.
     */
	set opcode (_o) {
		if (_o === null) {
			throw ErrorFactory('DNS Header opcode cannot be null', null);
		}
		if (_o.value === undefined) {
			_o = OperationCodes.findOPCodeByValue(parseInt(_o));
		}
		this._opcode = _o;
	}

    /**
     * @name _decodeOpcode
     * @access private
     * @type {Function}
     *
     * @description Decodes the opcode value from the header data.
     *
     * @param {Number} byte
     */
	_decodeOpcode (byte) {
		return ((byte & 0x78) << 3);
	}

    /**
     * @name aa Getter
     * @access public
     * @type {Number}
     *
     * @description Authoritative Answer - this bit is valid in responses, and specifies that the responding name server is an authority for the domain name in question section. Note that the contents of the answer section may have multiple owner names because of aliases.  The AA bitcorresponds to the name which matches the query name, or the first owner name in the answer section.
     */
	get aa () {
		return this._aa;
	}

    /**
     * @name aa Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for aa.
     *
     * @param {Number} _a A value representing if the responding DNS server is an authority for the domain name in question 1 is true 0 is false;
     */
	set aa (_a) {
		if (_a === null) {
			throw ErrorFactory('DNS Header aa cannot be null', null);
		}
		this._aa = _a;
	}

    /**
     * @name _decodeAa
     * @access private
     * @type {Function}
     *
     * @description Decodes the aa value from the header data.
     *
     * @param {Number} byte
     */
	_decodeAa (byte) {
		return (byte & 0x04) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name tc Getter
     * @access public
     * @type {Number}
     *
     * @description TrunCation - specifies that this message was truncated due to length greater than that permitted on the transmission channel.
     */
	get tc () {
		return this._tc;
	}

    /**
     * @name tc Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for tc.
     *
     * @param {Number} _t An object representing the QType from the QTypes module.
     */
	set tc (_t) {
		if (_t === null) {
			throw ErrorFactory('DNS Header tc cannot be null', null);
		}
		this._tc = _t;
	}

    /**
     * @name _decodeTc
     * @access private
     * @type {Function}
     *
     * @description Decodes the tc value from the header data.
     *
     * @param {Number} byte
     */
	_decodeTc (byte) {
		return (byte & 0x02) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name rd Getter
     * @access public
     * @type {Number}
     *
     * @description Recursion Desired - this bit may be set in a query and is copied into the response.  If RD is set, it directs the name server to pursue the query recursively. Recursive query support is optional.
     */
	get rd () {
		return this._rd;
	}

    /**
     * @name rd Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for rd.
     *
     * @param {Object} _r An integer representing is recursion is desired 1 is true 0 is false.
     */
	set rd (_r) {
		if (_r === null) {
			throw ErrorFactory('DNS Header rd cannot be null', null);
		}
		this._rd = _r;
	}

    /**
     * @name _decodeRd
     * @access private
     * @type {Function}
     *
     * @description Decodes the rd value from the header data.
     *
     * @param {Number} byte
     */
	_decodeRd (byte) {
		return (byte & 0x01) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name ra Getter
     * @access public
     * @type {Number}
     *
     * @description Recursion Available - this be is set or cleared in a response, and denotes whether recursive query support is available in the name server.
     */
	get ra () {
		return this._ra;
	}

    /**
     * @name ra Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qtype.
     *
     * @param {Number} _r An integer representing is recursion is available 1 is true 0 is false.
     */
	set ra (_r) {
		if (_r === null) {
			throw ErrorFactory('DNS Header ra cannot be null', null);
		}
		this._ra = _r;
	}

    /**
     * @name _decodeRa
     * @access private
     * @type {Function}
     *
     * @description Decodes the ra value from the header data.
     *
     * @param {Number} byte
     */
	_decodeRa (byte) {
		return (byte & 0x80) !== 0x00 ? 0x01 : 0x00;
	}

    /**
     * @name z Getter
     * @access public
     * @type {Number}
     *
     * @description Reserved for future use. Must be zero in all queries and responses.
     */
	get z () {
		return 0; // this._z;
	}

    /**
     * @name z Setter
     * @access public
     * @type {Function}
     *
     * @description DO NOT USE THIS METHOD!!!!! z must always be zero per RFC 1035. This is the setter method for z.
     *
     * @param {Number} _ sets the value of the z variable.
     */
	// set z (_) {
	// 	z = _;
	// 	throw ErrorFactory('z cannot be set. it must always be 0 per RFC 1035', null);
	// }

    /**
     * @name rcode Getter
     * @access public
     * @type {Object}
     *
     * @description Response code - this 4 bit field is set as part of responses.
     */
	get rcode () {
		return this._rcode;
	}

    /**
     * @name rcode Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for rcode.
     *
     * @param {Object | Number} _r An object representing the RCode from the ResponseCodes module.
     */
	set rcode (_r) {
		if (_r === null) {
			throw ErrorFactory('DNS Header rcode cannot be null', null);
		}
		if (_r.value === undefined) {
			_r = ResponseCodes.findRCodeByValue(parseInt(_r));
		}
		this._rcode = _r;
	}

    /**
     * @name _decodeRcode
     * @access private
     * @type {Function}
     *
     * @description Decodes the rcode value from the header data.
     *
     * @param {Number} byte
     */
	_decodeRcode (byte) {
		return 0x0F & byte;
	}

    /**
     * @name qdcount Getter
     * @access public
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of entries in the question section.
     */
	get qdcount () {
		return this._qdcount;
	}

    /**
     * @name qdcount Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qdcount.
     *
     * @param {Number} _q The number of questions for the DNS message.
     */
	set qdcount (_q) {
		if (_q === null) {
			throw ErrorFactory('DNS Header qdcount cannot be null', null);
		}
		this._qdcount = _q;
	}

    /**
     * @name ancount Getter
     * @access public
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of resource records in the answer section.
     */
	get ancount () {
		return this._ancount;
	}

    /**
     * @name ancount Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for ancount.
     *
     * @param {Number} _a The number of answer records for the DNS message.
     */
	set ancount (_a) {
		if (_a === null) {
			throw ErrorFactory('DNS Header ancount cannot be null', null);
		}
		this._ancount = _a;
	}

    /**
     * @name nscount Getter
     * @access private
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of name server resource records in the authority records section.
     */
	get nscount () {
		return this._nscount;
	}

    /**
     * @name nscount Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for nscount.
     *
     * @param {Number} _n The number of nameserver records for the DNS message.
     */
	set nscount (_n) {
		if (_n === null) {
			throw ErrorFactory('DNS Header nscount cannot be null', null);
		}
		this._nscount = _n;
	}

    /**
     * @name arcount Getter
     * @access public
     * @type {Number}
     *
     * @description An unsigned 16 bit integer specifying the number of resource records in the additional records section.
     */
	get arcount () {
		return this._arcount;
	}

    /**
     * @name arcount Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for arcount.
     *
     * @param {Number} _a The number of additional records for the DNS message.
     */
	set arcount (_a) {
		if (_a === null) {
			throw ErrorFactory('DNS Header arcount cannot be null', null);
		}
		this._arcount = _a;
	}

    /**
     * @name headerLength Getter
     * @access public
     * @type {Number}
     *
     * @description This is the length in bytes of the header.
     */
	get headerLength () {
		return this._headerLength;
	}

    /**
     * @name headerLength
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for headerLength.
     *
     * @param {Number} length The length of the header for the DNS message. (Per RFC 1035 this could always be 12)
     */
	set headerLength (length) {
		this._headerLength = length;
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
	_encodeFlagBytes (_qr, _opcode, _aa, _tc, _rd, _ra, _z, _rcode) {
        // get your bits in a row :-)
		let flagValue = (((_qr << 15) | (_opcode << 11) | (_aa << 10) | (_tc << 9) | (_rd << 8) | (_ra << 7) | (_z << 4) | (_rcode << 0)) & 0xFFFF);
		return [((flagValue >> 8)), (flagValue & 0xFF)];
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
	decodeDNSHeaderFromMessage (data) {
		let index = 0;
		this.id = Utilities.decode16BitValue(data[index++], data[index++]);
		let flagHighByte = data[index++];
		let flagLowByte = data[index++];
		this.qr = this._decodeQr(flagHighByte);
		this.opcode = this._decodeOpcode(flagHighByte);
		this.aa = this._decodeAa(flagHighByte);
		this.tc = this._decodeTc(flagHighByte);
		this.rd = this._decodeRd(flagHighByte);
		this.ra = this._decodeRa(flagLowByte);
        // We do not decode the Z value because it is always 0 per RFC 1035 4.1.1
		this.rcode = this._decodeRcode(flagLowByte);
		this.qdcount = Utilities.decode16BitValue(data[index++], data[index++]);
		this.ancount = Utilities.decode16BitValue(data[index++], data[index++]);
		this.nscount = Utilities.decode16BitValue(data[index++], data[index++]);
		this.arcount = Utilities.decode16BitValue(data[index++], data[index++]);
		this.headerLength = index;
	}

    /**
     * @name setHeaderProperties
     * @access public
     * @function
     *
     * @description This function populates the header object with the properties on the object passed into the function.
     *
     * @param {Object} dnsHeaderInfo This is an object containing the properties for the DNS header.
     */
	setHeaderProperties (dnsHeaderInfo) {
		let _id = Utilities.isNullOrUndefined(dnsHeaderInfo.id) ? DNSMesageHeader.generateRandomID() : dnsHeaderInfo.id;
		this.id = (_id);
		this.qr = (dnsHeaderInfo.qr);
		this.opcode = (dnsHeaderInfo.opcode);
		this.aa = (dnsHeaderInfo.aa);
		this.tc = (dnsHeaderInfo.tc);
		this.rd = (dnsHeaderInfo.rd);
		this.ra = (dnsHeaderInfo.ra);
		// Z value because it is always 0 per RFC 1035 4.1.1
		this.rcode = dnsHeaderInfo.rcode;
		this.qdcount = dnsHeaderInfo.qdcount;
		this.ancount = dnsHeaderInfo.ancount;
		this.nscount = dnsHeaderInfo.nscount;
		this.arcount = dnsHeaderInfo.arcount;
	};

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
	encodeHeaderForMessage (dnsHeaderInfo) {
		dnsHeaderInfo = dnsHeaderInfo || {};
		let _id = Utilities.isNullOrUndefined(dnsHeaderInfo.id) ? this.id : dnsHeaderInfo.id;
		if (Utilities.isNullOrUndefined(_id)) {
			_id = DNSMesageHeader.generateRandomID();
		}
		this.id = _id;
		this.qr = (Utilities.isNullOrUndefined(dnsHeaderInfo.qr) ? this.qr : dnsHeaderInfo.qr);
		this.opcode = (Utilities.isNullOrUndefined(dnsHeaderInfo.opcode) ? this.opcode : dnsHeaderInfo.opcode);
		this.aa = (Utilities.isNullOrUndefined(dnsHeaderInfo.aa) ? this.aa : dnsHeaderInfo.aa);
		this.tc = (Utilities.isNullOrUndefined(dnsHeaderInfo.tc) ? this.tc : dnsHeaderInfo.tc);
		this.rd = (Utilities.isNullOrUndefined(dnsHeaderInfo.rd) ? this.rd : dnsHeaderInfo.rd);
		this.ra = (Utilities.isNullOrUndefined(dnsHeaderInfo.ra) ? this.ra : dnsHeaderInfo.ra);
		// Z value because it is always 0 per RFC 1035 4.1.1
		this.rcode = (Utilities.isNullOrUndefined(dnsHeaderInfo.rcode) ? this.rcode : dnsHeaderInfo.rcode);
		this.qdcount = (Utilities.isNullOrUndefined(dnsHeaderInfo.qdcount) ? this.qdcount : dnsHeaderInfo.qdcount);
		this.ancount = (Utilities.isNullOrUndefined(dnsHeaderInfo.ancount) ? this.ancount : dnsHeaderInfo.ancount);
		this.nscount = (Utilities.isNullOrUndefined(dnsHeaderInfo.nscount) ? this.nscount : dnsHeaderInfo.nscount);
		this.arcount = (Utilities.isNullOrUndefined(dnsHeaderInfo.arcount) ? this.arcount : dnsHeaderInfo.arcount);

		let headerBuffer = new Uint8Array(12);
		let idBytes = Utilities.encode16BitValue(this.id);
		let offset = 0;
		headerBuffer.set(idBytes, offset);
		offset += idBytes.length;
		let flagBytes = this._encodeFlagBytes(this.qr, this.opcode.value, this.aa, this.tc, this.rd, this.ra, this.z, this.rcode.value);
		headerBuffer.set(flagBytes, offset);
		offset += flagBytes.length;
		let qdBytes = Utilities.encode16BitValue(this.qdcount);
		headerBuffer.set(qdBytes, offset);
		offset += qdBytes.length;
		let anBytes = Utilities.encode16BitValue(this.ancount);
		headerBuffer.set(anBytes, offset);
		offset += anBytes.length;
		let nsBytes = Utilities.encode16BitValue(this.nscount);
		headerBuffer.set(nsBytes, offset);
		offset += nsBytes.length;
		let arBytes = Utilities.encode16BitValue(this.arcount);
		headerBuffer.set(arBytes, offset);
		offset += arBytes.length;
		this.headerLength = headerBuffer.length;

		return headerBuffer;
	}

	static generateRandomID () {
		return Math.floor(Math.random() * (0xFFFF - 0x0001)) + 0x0001;
	}
}

module.exports = DNSMesageHeader;
