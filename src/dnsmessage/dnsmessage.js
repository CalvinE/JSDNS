/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let DNSHeader = require('./dnsheader');
let DNSQuestion = require('./dnsquestion');
let DNSResourceRecord = require('./dnsresourcerecord');
let Utilities = require('../utilities');

/**
 * @name DNSMessage
 * @type {class}
 * @access public
 *
 * @description A representation of an entire DNS message complete with all of its sections.
 */
class DNSMessage {
	constructor () {
		this._header = null;
		this._questions = [];
		this._answers = [];
		this._nameservers = [];
		this._additionalResources = [];
		this._length = 0;
	}
    /**
     * @name header Getter
     * @access public
     * @type {DNSHeader}
     * @function
     *
     * @description The header of the DNS message.
     */
	get header () {
		return this._header;
	}

    /**
     * @name header Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qname.
     *
     * @param {DNSHeader} _h A DNSHeader object.
     */
	set header (_h) {
		this._header = _h;
	}

    /**
     * @name questions Getter
     * @access public
     * @type {Array.<DNSQuestion>}
     *
     * @description An array of questions for this message.
     */
	get questions () {
		return this._questions;
	}

    /**
     * @name answers Getter
     * @access public
     * @type {Array.<DNSResourceRecord>}
     *
     * @description An array of answers for this message.
     */
	get answers () {
		return this._answers;
	}

    /**
     * @name nameservers Getter
     * @access public
     * @type {Array.<DNSResourceRecord>}
     *
     * @description An array of nameservers for this message.
     */
	get nameservers () {
		return this._nameservers;
	}

    /**
     * @name additionalResources Getter
     * @access public
     * @type {Array.<DNSResourceRecord>}
     *
     * @description An array of additional records for this message.
     */
	get additionalResources () {
		return this._additionalResources;
	}

    /**
     * @name length Getter
     * @access public
     * @type {number}
     *
     * @description This is the length of the DNS message in bytes.
     */
	get length () {
		return this._length;
	}

    /**
     * @name length Setter
     * @access public
     * @type {Function}
     *
     * @description This is the setter method for qname.
     *
     * @param {Integer} _length The length of the message in bytes.
     */
	set length (_length) {
		this._length = _length;
	}

    /**
     * @name questionsCount Getter
     * @access public
     * @function
     *
     * @description This function returns the number of questions associated with this DNS Message.
     *
     * @returns {Number}
     */
	get questionsCount () {
		return this._questions.length;
	};

    /**
     * @name answersCount Getter
     * @access public
     * @function
     *
     * @description This function returns the number of answers associated with this DNS Message.
     *
     * @returns {Number}
     */
	get answersCount () {
		return this._answers.length;
	};

    /**
     * @name nameserversCount Getter
     * @access public
     * @function
     *
     * @description This function returns the number of name servers associated with this DNS Message.
     *
     * @returns {Number}
     */
	get nameserversCount () {
		return this._nameservers.length;
	}

    /**
     * @name additionalResourcesCount Getter
     * @access public
     * @function
     *
     * @description This function returns the number of additional resources associated with this DNS Message.
     *
     * @returns {Number}
     */
	get additionalResourcesCount () {
		return this._additionalResources.length;
	};

    /**
	 * @name setMessageAsResponse
	 * @access public
	 * @function
	 *
	 * @description This function is used to set the appropriate header flags in the dns message to prepare it for returning to the client that sent it.
	 *
	 * @param {DNSMessage} dnsQuery The dns message to be modified for the return trip to the client.
	 * @param {Number} aa A 1 or 0 value to set the AA flag.
	 * @param {Number} tc A 1 or 0 value to set the TC flag.
	 * @param {Number} ra A 1 or 0 value to set the RA flag.
	 * @param {Number} rcode A valid rcode value.
	 *
	 * @return {DNSMessage} The modified message ready for the return trip!
	 */
	setMessageAsResponse (aa = 0, tc = 0, ra = 0, rcode = 0) {
		this.header.qr = 1; // Set header QR flag to 1 to indicate it is a response
		this.header.aa = aa; // Set header AA Flag
		this.header.tc = tc; // Set header TC Flag
		this.header.ra = ra; // Set header RA flag
		this.header.rcode = rcode; // Set header RCODE
	};

    /**
     * @name validateMessageIsQuery
     * @access public
     * @function
     *
     * @description This function validates the message to make sure it is a valid query and the header flags are not set in a strange way.
     *
     * @returns {Boolean} returns true if it is a valid query and false if not.
     */
	validateMessageIsQuery () {
		let isValid = false;

		if (this.header.qr === 0 &&
            this.header.aa === 0 &&
            this.header.tc === 0 &&
            this.header.z === 0 &&
            this.header.ra === 0 &&
            this.header.rcode.value === 0 &&
            this.header.ancount === 0 && // Check the header counts
            this.header.nscount === 0 &&
            this.header.arcount === 0 &&
            this.answersCount === 0 && // And the actual fields in the message to ensure someone is not trying to mess with us :-).
            this.nameserversCount === 0 &&
            this.additionalResourcesCount === 0) {
			isValid = true;
		}

		return isValid;
	};

	setMessageProperties (messageProperties) {
		this.header = new DNSHeader();
		this.header.setHeaderProperties(messageProperties.header);
		if (Utilities.isNullOrUndefined(messageProperties.questions) === false) {
			for (let i = 0; i < messageProperties.questions.length; i++) { // There should only be one question unless the issues around multiple questions in a single query are resolved in later spec documents.
				let q = new DNSQuestion();
				q.setQuestionProperties(messageProperties.questions[i]);
				this.questions.push(q);
			}
		}

		if (Utilities.isNullOrUndefined(messageProperties.answers) === false) {
			for (let i = 0; i < messageProperties.answers.length; i++) {
				let rr = new DNSResourceRecord();
				rr.setResourceRecordProperties(messageProperties.answers[i]);
				this.answers.push(rr);
			}
		}

		if (Utilities.isNullOrUndefined(messageProperties.nameservers) === false) {
			for (let i = 0; i < messageProperties.nameservers.length; i++) {
				let rr = new DNSResourceRecord();
				rr.setResourceRecordProperties(messageProperties.nameservers[i]);
				this.nameservers.push(rr);
			}
		}

		if (Utilities.isNullOrUndefined(messageProperties.additionalResources) === false) {
			for (let i = 0; i < messageProperties.additionalResources.length; i++) {
				let rr = new DNSResourceRecord();
				rr.setResourceRecordProperties(messageProperties.additionalResources[i]);
				this.additionalResources.push(rr);
			}
		}
	};

    /**
     * @name parseRequest
     * @access public
     * @type {Function}
     *
     * @description parses the bytes of a DNS message to populate a model representing the message.
     *
     * @param {UInt8Array} messageData This is the raw message data in bytes
     */
	parseRequest (messageData) {
		let offset = 0;
		this.header = new DNSHeader();
		this.header.decodeDNSHeaderFromMessage(messageData);
		offset = this.header.length;
        // Parse Questions
		for (let i = 0; i < this.header.qdcount; i++) {
			let q = new DNSQuestion();
			q.decodeDNSQuestionFromMessage(messageData, offset);
			offset += q.length;
			this.questions.push(q);
		}
        // Parse Answers
		for (let i = 0; i < this.header.ancount; i++) {
			let rr = new DNSResourceRecord();
			rr.decodeDNSResourceRecordFromMessage(messageData, offset);
			offset += rr.length;
			this.answers.push(rr);
		}
        // Parse Nameservers
		for (let i = 0; i < this.header.nscount; i++) {
			let rr = new DNSResourceRecord();
			rr.decodeDNSResourceRecordFromMessage(messageData, offset);
			offset += rr.length;
			this.nameservers.push(rr);
		}
        // Parse Additional Resources
		for (let i = 0; i < this.header.arcount; i++) {
			let rr = new DNSResourceRecord();
			rr.decodeDNSResourceRecordFromMessage(messageData, offset);
			offset += rr.length;
			this.additionalResources.push(rr);
		}

		this.length = offset;
	};

    /**
     * @name encodeMessageToBuffer
     * @access public
     * @type {Function}
     *
     * @description Takes the DNSMessage object and returns buffer with the raw DNS message in bytes.
     *
     * @param {UInt8Array} messageData This is the raw message data in bytes
     *
     * @returns {Buffer} A Buffer containing the raw bytes of the DNS message.
     */
	encodeMessageToBuffer () { // TODO: make this use name compression.
		let headerData = this.header.encodeHeaderForMessage();
		let offset = headerData.length;
		// let questionData = [];
		// let answerData = [];
		// let nameserverData = [];
		// let additionalresourcesData = [];
		let messageData = [].concat(headerData);
        // Parse Questions
		for (let i = 0; i < this.questions.length; i++) {
			let qData = this.questions[i].encodeQuestionForMessage({}, offset);
			offset += qData.length;
			messageData = messageData.concat(qData);
			// questionData.push(qData);
		}
        // Parse Answers
		for (let i = 0; i < this.answers.length; i++) {
			let rrData = this.answers[i].encodeResourceRecordForMessage({}, offset);
			offset += rrData.length;
			messageData = messageData.concat(rrData);
			// answerData.push(rrData);
		}
        // Parse Nameservers
		for (let i = 0; i < this.nameservers.length; i++) {
			let rrData = this.nameservers[i].encodeResourceRecordForMessage({}, offset);
			offset += rrData.length;
			messageData = messageData.concat(rrData);
			// nameserverData.push(rrData);
		}
        // Parse Additional Resources
		for (let i = 0; i < this.additionalResources.length; i++) {
			let rrData = this.additionalResources[i].encodeResourceRecordForMessage({}, offset);
			offset += rrData.length;
			messageData = messageData.concat(rrData);
			// additionalresourcesData.push(rrData);
		}

		this.length = offset;

		let data = [];

		for (let i = 0; i < messageData.length; i++) {
			data.push.apply(data, messageData[i]);
		}

		return Buffer.from(data);
	}
}

module.exports = DNSMessage;
