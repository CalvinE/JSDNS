/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const Types = require('../dnsmessage/constants/types');
const Classes = require('../dnsmessage/constants/classes');
const DNSUtils = require('../dnsmessage/dnsutilities');
const Utilities = require('../utilities');
const ErrorFactory = require('../error');

/**
 * @name DNSQuestion
 * @class {DNSQuestion} DNSQuestion
 * @access public
 *
 * @description A representation of a DNS message question and functions for encoding this data for reading and decoding this data for transmission.
 */
class DNSQuestion {
	constructor () {
		this._qname = null;
		this._qtype = null;
		this._qclass = null;
		this._questionStartIndex = null;
		this._length = null;
		this._index = 0;
	}
    /**
     * @name qname Getter
     * @access public
     * @type {String}
     *
     * @description A domain name represented as a sequence of labels, where each label consists of a length octet followed by that number of octets. The domain name terminates with the zero length octet for the null label of the root. Note that this field may be an odd number of octets; no padding is used.
     */
	get qname () {
		return this._qname;
	}

    /**
     * @name qname Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qname.
     *
     * @param {String} _q A string of labels delimited by a . character.
     */
	set qname (_q) {
		this._qname = _q;
	}

    /**
     * @name _decodeQname
     * @access private
     * @type {Function}
     *
     * @description Decodes the domain name from the question data. Also it advances the index variable to keep track of how to parse the message.
     *
     * @param {Array} qNameBytes This is the array of bytes that represent the entire DNS message.
     *
     * @returns {String} A period delimited list of labels with the TLD in the last index.
     */
	_decodeQname (qNameBytes) {
		let qNameData = DNSUtils.decodeName(qNameBytes, this.index);
		this.index = qNameData.indexPosPostReading;
		return qNameData.name.join('.');
	};

    /**
     * @name qtype Getter
     * @access public
     * @type {Object}
     *
     * @description A two octet code which specifies the type of the query. The values for this field include all codes valid for a TYPE field, together with some more general codes which can match more than one type of RR.
     */
	get qtype () {
		return this._qtype;
	}

    /**
     * @name qtype Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qtype.
     *
     * @param {Object | Number} _q An object representing the QType from the QTypes module.
     */
	set qtype (_q) {
		if (Utilities.isNullOrUndefined(_q) === true) {
			throw ErrorFactory('DNS Question type cannot be null', null);
		}
		if (_q.value === undefined) {
			_q = Types.findTypeByValue(parseInt(_q));
		}
		this._qtype = _q;
	};

    /**
     * @name qclass Getter
     * @access public
     * @type {Object}
     *
     * @description A two octet code that specifies the class of the query. For example, the QCLASS field is IN for the Internet.
     */
	get qclass () {
		return this._qclass;
	}

    /**
     * @name qclass Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qclass.
     *
     * @param {Object | Number} _q An object representing the QClass from the QClasses module.
     */
	set qclass (_q) {
		if (Utilities.isNullOrUndefined(_q) === true) {
			throw ErrorFactory('DNS Question class cannot be null', null);
		}
		if (_q.value === undefined) {
			_q = Classes.findClassByValue(parseInt(_q));
		}
		this._qclass = _q;
	};

    /**
     * @name questionStartIndex Getter
     * @access public
     * @type {Number}
     *
     * @description This is the absolute position in the byte array where this question begins.
     */
	get questionStartIndex () {
		return this._questionStartIndex;
	}

    /**
     * @name setQuestionStartIndex
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for questionStartIndex.
     *
     * @param {Number} index An integer representing the starting index of this question relative to the whole message.
     */
	set questionStartIndex (index) {
		this._questionStartIndex = index;
	};

    /**
     * @name length Getter
     * @access public
     * @type {Number}
     *
     * @description This is the length of the question in bytes.
     */
	get length () {
		return this._length;
	}

    /**
     * @name setQuestionLength
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
     * @description This variable is used to keep track of the current index as we parse the question data.
     */
	get index () {
		return this._index;
	}

    /**
     * @name index Setter
     * @access public
     * @type {Number}
     *
     * @description This variable is used to keep track of the current index as we parse the question data.
     * @param {Number} index is the current index of the DNS Question, used for parsing.
     */
	set index (index) {
		this._index = index;
	}

    /**
     * @name setQuestionProperties
     * @access public
     * @function
     *
     * @description This function populates the question object with the properties on the object passed into the function.
     *
     * @param {Object} dnsQuestionInfo This is an object containing the properties for the DNS question.
     */
	setQuestionProperties (dnsQuestionInfo) {
		this.qname = dnsQuestionInfo.qname;
		this.qtype = dnsQuestionInfo.qtype;
		this.qclass = dnsQuestionInfo.qclass;
	}

    /**
     * @name decodeDNSQuestionFromMessage
     * @access public
     * @type {Function}
     *
     * @description This function takes the byte array containing the DNS message and populates the model with the messages question data at the specified offset in the array.
     *
     * @param {Uint8Array} data This is an array containing the bytes of the complete DNS message.
     * @param {Number} offset This is an integer representing the offset to be used for parsing the question data.
     */
	decodeDNSQuestionFromMessage (data, offset) {
		this.index = offset;
		this.questionStartIndex = this.index;
		this.qname = this._decodeQname(data);
		this.qtype = Utilities.decode16BitValue(data[this.index++], data[this.index++]);
		this.qclass = Utilities.decode16BitValue(data[this.index++], data[this.index++]);
		this.length = this.index - offset;
	};

    /**
     * @name encodeQuestionForMessage
     * @access public
     * @type {Function}
     *
     * @description Encodes a dns question into a Uint8Array based on either the properties set on the variables of this class or from the object passed into the function. If a property is missing from the object then this function will attempt to use the getter function for that property, and if both are absent an error will be thrown.
     *
     * @param {Object} dnsQuestionInfo An object with properties with the same names as the private variables used in this class.
     * @param {Number} startIndex The starting index of this question in the overall message.
     *
     * @returns {Uint8Array} An array of bytes representing the DNS Question.
     */
	encodeQuestionForMessage (dnsQuestionInfo, startIndex) {
		dnsQuestionInfo = dnsQuestionInfo || {};
		this.qname = (Utilities.isNullOrUndefined(dnsQuestionInfo.qname) ? this.qname : dnsQuestionInfo.qname);
		this.qtype = (Utilities.isNullOrUndefined(dnsQuestionInfo.qtype) ? this.qtype : dnsQuestionInfo.qtype);
		this.qclass = (Utilities.isNullOrUndefined(dnsQuestionInfo.qclass) ? this.qclass : dnsQuestionInfo.qclass);

		let qLength = 0;
		let offset = 0;
		let qname = DNSUtils.encodeName(this.qname);
		qLength += qname.length;
		let qtype = Utilities.encode16BitValue(this.qtype.value);
		qLength += qtype.length;
		let qclass = Utilities.encode16BitValue(this.qclass.value);
		qLength += qclass.length;

		let questionBuffer = new Uint8Array(qLength);

		questionBuffer.set(qname, offset);
		offset += qname.length;
		questionBuffer.set(qtype, offset);
		offset += qtype.length;
		questionBuffer.set(qclass, offset);
		offset += qclass.length;

		this.length = questionBuffer.length;
		this.questionStartIndex = startIndex;

		return questionBuffer;
	}
}

module.exports = DNSQuestion;
