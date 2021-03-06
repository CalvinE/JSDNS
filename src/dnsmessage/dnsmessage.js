/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let DNSHeader = require('./dnsheader');
let DNSQuestion = require('./dnsquestion');
let DNSResourceRecord = require('./dnsresourcerecord');

/**
 * @name DNSMessage
 * @type {class}
 * @access public
 *
 * @description A representation of an entire DNS message complete with all of its sections.
 */
function DNSMessage () {
    /**
     * @name id
     * @access private
     * @type {DNSHeader}
     * @function
     *
     * @description The header of the DNS message.
     */
	let header = null;

    /**
     * @name questions
     * @access private
     * @type {Array.<DNSQuestion>}
     *
     * @description An array of questions for this message.
     */
	let questions = [];

    /**
     * @name answers
     * @access private
     * @type {Array.<DNSResourceRecord>}
     *
     * @description An array of answers for this message.
     */
	let answers = [];

    /**
     * @name nameservers
     * @access private
     * @type {Array.<DNSResourceRecord>}
     *
     * @description An array of nameservers for this message.
     */
	let nameservers = [];

    /**
     * @name additionalResources
     * @access private
     * @type {Array.<DNSResourceRecord>}
     *
     * @description An array of additional records for this message.
     */
	let additionalResources = [];

    /**
     * @name messageLength
     * @access private
     * @type {number}
     *
     * @description This is the length of the DNS message in bytes.
     */
	let messageLength = 0;

    /**
     * @name getHeader
     * @access public
     * @type {Function}
     *
     * @description This is the getter method for the dns message header.
     *
     * @returns {DNSHeader} The current value of the header variable.
     */
	function getHeader () {
		return header;
	};

    /**
     * @name getQuestions
     * @access public
     * @type {Function}
     *
     * @description This is the getter method for the dns message questions.
     *
     * @returns {Array.<DNSQuestion>} The current value of the questions variable.
     */
	function getQuestions () {
		return questions;
	};

    /**
     * @name getQuestionsCount
     * @access public
     * @function
     *
     * @description This function returns the number of questions associated with this DNS Message.
     *
     * @returns {Number}
     */
	function getQuestionsCount () {
		return questions.length;
	};

    /**
     * @name getAnswers
     * @access public
     * @type {Function}
     *
     * @description This is the getter method for the dns message answers.
     *
     * @returns {Array.<DNSResourceRecord>} The current value of the answers variable.
     */
	function getAnswers () {
		return answers;
	};

    /**
     * @name getAnswersCount
     * @access public
     * @function
     *
     * @description This function returns the number of answers associated with this DNS Message.
     *
     * @returns {Number}
     */
	function getAnswersCount () {
		return answers.length;
	};

    /**
     * @name getNameservers
     * @access public
     * @type {Function}
     *
     * @description This is the getter method for the dns message answers.
     *
     * @returns {Array.<DNSResourceRecord>} The current value of the nameservers variable.
     */
	function getNameservers () {
		return nameservers;
	};

    /**
     * @name getNameserversCount
     * @access public
     * @function
     *
     * @description This function returns the number of name servers associated with this DNS Message.
     *
     * @returns {Number}
     */
	function getNameserversCount () {
		return nameservers.length;
	};

    /**
     * @name getAdditionalResources
     * @access public
     * @type {Function}
     *
     * @description This is the getter method for the dns message additional resources.
     *
     * @returns {Array.<DNSResourceRecord>} The current value of the additionalResources variable.
     */
	function getAdditionalResources () {
		return additionalResources;
	};

    /**
     * @name getAdditionalResourcesCount
     * @access public
     * @function
     *
     * @description This function returns the number of additional resources associated with this DNS Message.
     *
     * @returns {Number}
     */
	function getAdditionalResourcesCount () {
		return additionalResources.length;
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
	function parseRequest (messageData) {
		let offset = 0;
		header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(messageData);
		offset = header.getHeaderLength();
        // Parse Questions
		for (let i = 0; i < header.getQdcount(); i++) {
			let q = new DNSQuestion();
			q.decodeDNSQuestionFromMessage(messageData, offset);
			offset += q.getQuestionLength();
			questions.push(q);
		}
        // Parse Answers
		for (let i = 0; i < header.getAncount(); i++) {
			let rr = new DNSResourceRecord();
			rr.decodeDNSResourceRecordFromMessage(messageData, offset);
			offset += rr.getResourceRecordLength();
			answers.push(rr);
		}
        // Parse Nameservers
		for (let i = 0; i < header.getNscount(); i++) {
			let rr = new DNSResourceRecord();
			rr.decodeDNSResourceRecordFromMessage(messageData, offset);
			offset += rr.getResourceRecordLength();
			nameservers.push(rr);
		}
        // Parse Additional Resources
		for (let i = 0; i < header.getArcount(); i++) {
			let rr = new DNSResourceRecord();
			rr.decodeDNSResourceRecordFromMessage(messageData, offset);
			offset += rr.getResourceRecordLength();
			additionalResources.push(rr);
		}

		messageLength = offset;
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
	function encodeMessageToBuffer () { // TODO: make this use name compression.
		let headerData = header.encodeHeaderForMessage();
		let offset = headerData.length;
		// let questionData = [];
		// let answerData = [];
		// let nameserverData = [];
		// let additionalresourcesData = [];
		let messageData = [].concat(headerData);
        // Parse Questions
		for (let i = 0; i < questions.length; i++) {
			let qData = questions[i].encodeQuestionForMessage({}, offset);
			offset += qData.length;
			messageData = messageData.concat(qData);
			// questionData.push(qData);
		}
        // Parse Answers
		for (let i = 0; i < answers.length; i++) {
			let rrData = answers[i].encodeResourceRecordForMessage({}, offset);
			offset += rrData.length;
			messageData = messageData.concat(rrData);
			// answerData.push(rrData);
		}
        // Parse Nameservers
		for (let i = 0; i < nameservers.length; i++) {
			let rrData = nameservers[i].encodeResourceRecordForMessage({}, offset);
			offset += rrData.length;
			messageData = messageData.concat(rrData);
			// nameserverData.push(rrData);
		}
        // Parse Additional Resources
		for (let i = 0; i < additionalResources.length; i++) {
			let rrData = additionalResources[i].encodeResourceRecordForMessage({}, offset);
			offset += rrData.length;
			messageData = messageData.concat(rrData);
			// additionalresourcesData.push(rrData);
		}

		messageLength = offset;

		let data = [];

		for (let i = 0; i < messageData.length; i++) {
			data.push.apply(data, messageData[i]);
		}

		return Buffer.from(data);
	};

	return {
		getHeader: getHeader,
		getQuestions: getQuestions,
		getQuestionsCount: getQuestionsCount,
		getAnswers: getAnswers,
		getAnswersCount: getAnswersCount,
		getNameservers: getNameservers,
		getNameserversCount: getNameserversCount,
		getAdditionalResources: getAdditionalResources,
		getAdditionalResourcesCount: getAdditionalResourcesCount,
		parseRequest: parseRequest,
		encodeMessageToBuffer: encodeMessageToBuffer,
		messageLength: messageLength
	};
};

module.exports = DNSMessage;
