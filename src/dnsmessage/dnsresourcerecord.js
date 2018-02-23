/*
 * Created on Sun Feb 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const Types = require('../dnsmessage/constants/types');
const Classes = require('../dnsmessage/constants/classes');
const DNSUtils = require('../dnsmessage/dnsutilities');
const Utilities = require('../utilities');
const ErrorFactory = require('../error');

/**
 * @name DNSResourceRecord
 * @class {DNSResourceRecord} DNSResourceRecord
 * @access public
 *
 * @description A representation of a DNS message resource record (RR) and functions for encoding this data for reading and decoding this data for transmission.
 */
class DNSResourceRecord {
	constructor () {
		this._name = null;
		this._type = null;
		this._rrClass = null;
		this._ttl = null;
		this._rdLength = null;
		this._rData = null;
		this._resourceRecordStartIndex = null;
		this._length = null;
		this._index = 0;
		this._isAuthoritative = false;
		this._cacheExpiration = null;
	}
    /**
     * @name name Getter
     * @access public
     * @type {String}
     *
     * @description an owner name, i.e., the name of the node to which this resource record pertains.
     */
	get name () {
		return this._name;
	}

    /**
     * @name name Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for name.
     *
     * @param {String} _n A string of labels delimited by a . character.
     */
	set name (_n) {
		this._name = _n;
	}

    /**
     * @name _decodeName
     * @access private
     * @type {Function}
     *
     * @description Decodes the domain name from the resourceRecord data. Also it advances the index variable to keep track of how to parse the message.
     *
     * @param {String} nameBytes This is the array of bytes that represent the entire DNS message.
     */
	_decodeName (nameBytes) {
		let nameData = DNSUtils.decodeName(nameBytes, this.index);
		this.index = nameData.indexPosPostReading;
		return nameData.name.join('.');
	}

    /**
     * @name type Getter
     * @access public
     * @type {Object}
     *
     * @description A two octet code which specifies the type of the resource record. The values for this field include all codes valid for a TYPE field, together with some more general codes which can match more than one type of RR.
     */
	get type () {
		return this._type;
	}

    /**
     * @name type Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for type.
     *
     * @param {Object | Number} _t An object representing the Type from the QTypes module.
     */
	set type (_t) {
		if (Utilities.isNullOrUndefined(_t) === true) {
			throw ErrorFactory('DNS Resource Record type cannot be null', null);
		}
		if (_t.value === undefined) {
			_t = Types.findTypeByValue(parseInt(_t));
		}
		this._type = _t;
	}

    /**
     * @name rrclass Getter
     * @access public
     * @type {Object}
     *
     * @description A two octet code that specifies the class of the resource record. For example, the QCLASS field is IN for the Internet.
     */
	get rrclass () {
		return this._rrClass;
	}

    /**
     * @name rrclass Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for rrclass.
     *
     * @param {Object | Number} _r An object representing the Class from the Classes module.
     */
	set rrclass (_r) {
		if (Utilities.isNullOrUndefined(_r) === true) {
			throw ErrorFactory('DNS Resource Record class cannot be null', null);
		}
		if (_r.value === undefined) {
			_r = Classes.findClassByValue(parseInt(_r));
		}
		this._rrClass = _r;
	}

    /**
     * @name ttl Getter
     * @access public
     * @type {Number}
     *
     * @description a 32 bit signed integer that specifies the time interval that the resource record may be cached before the source of the information should again be consulted. Zero values are interpreted to mean that the RR can only be used for the transaction in progress, and should not be cached. For example, SOA records are always distributed with a zero TTL to prohibit caching. Zero values can also be used for extremely volatile data.
     */
	get ttl () {
		return this._ttl;
	}

    /**
     * @name ttl Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for ttl.
     *
     * @param {Number} _t An object representing the ttl.
     */
	set ttl (_t) {
		this._ttl = _t;
	}

    /**
     * @name _decodeTtl
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
	_decodeTtl (byte1, byte2, byte3, byte4) {
		return (byte1 << 24) | (byte2 << 16) | (byte3 << 16) | (byte4);
	}

    /**
     * @name rdlength Getter
     * @access public
     * @type {Number}
     *
     * @description an unsigned 16 bit integer that specifies the length in octets of the RDATA field.
     */
	get rdlength () {
		return this._rdLength;
	}

    /**
     * @name rdlength
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for rdlength.
     *
     * @param {Number} _r An object representing the RDataLength.
     */
	set rdlength (_r) {
		this._rdLength = _r;
	}

    /**
     * @name rdata Getter
     * @access public
     * @type {object}
     *
     * @description a variable length string of octets that describes the resource. The format of this information varies according to the TYPE and CLASS of the resource record.
     */
	get rdata () {
		return this._rData;
	}

    /**
     * @name rdata Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for rdata.
     *
     * @param {Object} _r An object representing the rdata.
     */
	set rdata (_r) {
		this._rData = _r;
	}

    /**
     * @name _decodeRdata
     * @access private
     * @type {Function}
     *
     * @description Decodes the rdata from the resource record data.
     *
     * @param {Array} data
     *
     * @returns {any} Whatever the RR data is.
     */
	_decodeRdata (data) {
		let rrtypeValue = this.type.value;
		let rdata = null;
		switch (rrtypeValue) {
		case 1: // A record
			rdata = this._decodeARecordRData(data);
			break;
		case 2: // NS Record
			throw ErrorFactory('NS Records not implemented yet.', null);
        // break
		case 5: // CNAME Record
			throw ErrorFactory('CNAME Records not implemented yet.', null);
        // break
		case 6: // SOA Record
			throw ErrorFactory('SOA Records not implemented yet.', null);
        // break
		case 11: // WKS Record
			throw ErrorFactory('WKS Records not implemented yet.', null);
        // break
		case 12: // PTR Record
			throw ErrorFactory('PTR Records not implemented yet.', null);
        // break
		case 13: // HINFO Record
			throw ErrorFactory('HINFO Records not implemented yet.', null);
        // break
		case 14: // MINFO Record
			throw ErrorFactory('MINFO Records not implemented yet.', null);
        // break
		case 15: // MX Record
			throw ErrorFactory('MX Records not implemented yet.', null);
        // break
		case 16: // TXT Record
			throw ErrorFactory('TXT Records not implemented yet.', null);
        // break
		}
		return rdata;
	}

    /**
     * @name _encodeRdata
     * @access private
     * @type {Function}
     *
     * @description Decodes the rdata from the resource record data.
     *
     * @param {any} data The RData in what ever format is comes in.
     *
     * @returns {Array} An array of bytes representing the encoded form of the data.
     */
	_encodeRdata (data) {
		let rrtypeValue = this.type.value;
		let rdata = null;
		switch (rrtypeValue) {
		case 1: // A record
			rdata = this._encodeARecordRData(data);
			break;
		case 2: // NS Record
			throw ErrorFactory('NS Records not implemented yet.', null);
        // break
		case 5: // CNAME Record
			throw ErrorFactory('CNAME Records not implemented yet.', null);
        // break
		case 6: // SOA Record
			throw ErrorFactory('SOA Records not implemented yet.', null);
        // break
		case 11: // WKS Record
			throw ErrorFactory('WKS Records not implemented yet.', null);
        // break
		case 12: // PTR Record
			throw ErrorFactory('PTR Records not implemented yet.', null);
        // break
		case 13: // HINFO Record
			throw ErrorFactory('HINFO Records not implemented yet.', null);
        // break
		case 14: // MINFO Record
			throw ErrorFactory('MINFO Records not implemented yet.', null);
        // break
		case 15: // MX Record
			throw ErrorFactory('MX Records not implemented yet.', null);
        // break
		case 16: // TXT Record
			throw ErrorFactory('TXT Records not implemented yet.', null);
        // break
		}
		return rdata;
	}

    /**
     * @name resourceRecordStartIndex Getter
     * @access public
     * @type {Number}
     *
     * @description This is the absolute position in the byte array where this resource record begins.
     */
	get resourceRecordStartIndex () {
		return this._resourceRecordStartIndex;
	}

    /**
     * @name resourceRecordStartIndex Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for resourceRecordStartIndex.
     *
     * @param {Number} index An integer representing the starting index of this resource record relative to the whole message.
     */
	set resourceRecordStartIndex (index) {
		this._resourceRecordStartIndex = index;
	}

    /**
     * @name length Getter
     * @access public
     * @type {Number}
     *
     * @description This is the length of the resource record in bytes.
     */
	get length () {
		return this._length;
	}

    /**
     * @name length Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for length.
     *
     * @param {Number} length An the length of this message as a part of the whole DNS message.
     */
	set length (length) {
		this._length = length;
	};

    /**
     * @name index Getter
     * @access public
     * @type {Number}
     *
     * @description This variable is used to keep track of the current index as we parse the resource record data.
     */
	get index () {
		return this._index;
	}

    /**
     * @name index Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for index.
     *
     * @param {Number} _i the value of the index.
     */
	set index (_i) {
		this._index = _i;
	};

    /**
     * @name isAuthoritative Getter
     * @access public
     * @type {boolean}
     *
     * @description This variable indicates if the resource record is from an authoritative source.
     */
	get isAuthoritative () {
		return this._isAuthoritative;
	}

    /**
     * @name setIsAuthoritative Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for isAuthoritative.
     *
     * @param {boolean} _i A boolean value specifying if this record is from and authoritative source.
     */
	set isAuthoritative (_i) {
		this._isAuthoritative = _i;
	};

    /**
     * @name cacheExpiration Getter
     * @access public
     * @type {Date}
     *
     * @description This field is populated before it is stored in cache. The value of this property is
     */
	get cacheExpiration () {
		return this._cacheExpiration;
	}

    /**
     * @name cacheExpiration Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for cacheExpiration.
     *
     * @param {Number} seconds A number in seconds that is the TTL for this record.
     */
	set cacheExpiration (seconds) {
		seconds = parseInt(seconds);
		if (Utilities.isNullOrUndefined(seconds) === false && isNaN(seconds) === false) {
			this._cacheExpiration = new Date(Date.now() + (seconds * 1000));
		} else {
			this._cacheExpiration = null;
		}
	};

    /**
     * @name _decodeARecordRData
     * @access private
     * @type {Function}
     *
     * @description Decodes the rdata from an A type resource record.
     *
     * @param {Array} data
     */
	_decodeARecordRData (data) {
		let totalLength = this.index + this.rdlength;
		let hostAddress = [];
		while (this.index < totalLength) {
			hostAddress.push(data[this.index++].toString());
		}
		return hostAddress.join('.');
	}

    /**
     * @name _encodeARecordRData
     * @access private
     * @type {Function}
     *
     * @description Decodes the rdata from an A type resource record.
     *
     * @param {String} data The 32 bit host address as a tring delimited with periods.
     *
     * @returns {Array} Array of bytes representing the 32 bit host address with the MSB in the 0 index of the array.
     */
	_encodeARecordRData (data) {
		let result = [];
		data.split('.').forEach(function (octet) {
			result.push(octet & 0xFF);
		}, this);
		return result;
	}

    /**
     * @name isExpired
     * @access public
     * @function
     *
     * @description Returns true if this resource records cacheability has passed.
     *
     * @returns {Boolean}
     */
	isExpired () {
		return this.cacheExpiration < new Date();
	};

    /**
     * @name setResourceRecordProperties
     * @access public
     * @function
     *
     * @description This function populates the resource record object with the properties on the object passed into the function.
     *
     * @param {Object} dnsResourceRecordInfo This is an object containing the properties for the DNS resource record.
     */
	setResourceRecordProperties (dnsResourceRecordInfo) {
		this.name = dnsResourceRecordInfo.name;
		this.type = dnsResourceRecordInfo.type;
		this.rrclass = dnsResourceRecordInfo.rrclass;
		this.ttl = dnsResourceRecordInfo.ttl;
		this.cacheExpiration = dnsResourceRecordInfo.ttl;
		this.isAuthoritative = Utilities.isNullOrUndefined(dnsResourceRecordInfo.isAuthoritative) ? false : dnsResourceRecordInfo.isAuthoritative;
		this.rdlength = dnsResourceRecordInfo.rdlength;
		this.rdata = dnsResourceRecordInfo.rdata;
	};

    /**
     * @name decodeDNSResourceRecordFromMessage
     * @access public
     * @type {Function}
     *
     * @description This function takes the byte array containing the DNS message and populates the model with the messages resource record data at the specified offset in the array.
     *
     * @param {Uint8Array} data This is an array containing the bytes of the complete DNS message.
     * @param {Number} offset This is an integer representing the offset to be used for parsing the resource record data.
     * @param {Boolean} _isAuthoritative Boolean value that sets if the resource is from an authoritative source.
     */
	decodeDNSResourceRecordFromMessage (data, offset = 0, _isAuthoritative = false) {
		this.index = offset;
		this.resourceRecordStartIndex = this.index;
		this.name = this._decodeName(data);
		this.type = Utilities.decode16BitValue(data[this.index++], data[this.index++]);
		this.rrclass = Utilities.decode16BitValue(data[this.index++], data[this.index++]);
		this.ttl = this._decodeTtl(data[this.index++], data[this.index++], data[this.index++], data[this.index++]);
		this.cacheExpiration = this.ttl;
		this.isAuthoritative = _isAuthoritative;
		this.rdlength = Utilities.decode16BitValue(data[this.index++], data[this.index++]);
		this.rdata = this._decodeRdata(data);
		this.length = this.index - offset;
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
     * @param {Boolean} _isAuthoritative Boolean value that sets if the resource is from an authoritative source.
     *
     * @returns {Uint8Array} An array of bytes representing the DNS Resource Record.
     */
	encodeResourceRecordForMessage (dnsResourceRecordInfo, startIndex = 0, _isAuthoritative = false) {
		dnsResourceRecordInfo = dnsResourceRecordInfo || {};
		this.name = Utilities.isNullOrUndefined(dnsResourceRecordInfo.name) ? this.name : dnsResourceRecordInfo.name;
		this.type = Utilities.isNullOrUndefined(dnsResourceRecordInfo.type) ? this.type : dnsResourceRecordInfo.type;
		this.rrclass = Utilities.isNullOrUndefined(dnsResourceRecordInfo.rrclass) ? this.rrclass : dnsResourceRecordInfo.rrclass;
		this.ttl = Utilities.isNullOrUndefined(dnsResourceRecordInfo.ttl) ? this.ttl : dnsResourceRecordInfo.ttl;
		this.cacheExpiration = this.ttl;
		this.isAuthoritative = _isAuthoritative;
		this.rdlength = Utilities.isNullOrUndefined(dnsResourceRecordInfo.rdlength) ? this.rdlength : dnsResourceRecordInfo.rdlength;
		this.rdata = Utilities.isNullOrUndefined(dnsResourceRecordInfo.rdata) ? this.rdata : dnsResourceRecordInfo.rdata;

		let rrLength = 0;
		let offset = 0;
		let name = DNSUtils.encodeName(this.name);
		rrLength += name.length;
		let type = Utilities.encode16BitValue(this.type.value);
		rrLength += type.length;
		let rrclass = Utilities.encode16BitValue(this.rrclass.value);
		rrLength += rrclass.length;
		let ttl = Utilities.encode32BitValue(this.ttl);
		rrLength += ttl.length;
		let rdlength = Utilities.encode16BitValue(this.rdlength);
		rrLength += rdlength.length;
		let rdata = this._encodeRdata(this.rdata);
		rrLength += rdata.length;

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

		this.length = rrBuffer.length;
		this.resourceRecordStartIndex = startIndex;

		return rrBuffer;
	}
}

module.exports = DNSResourceRecord;
