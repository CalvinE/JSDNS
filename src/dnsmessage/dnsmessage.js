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
	}

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
	}

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
	}

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
	}

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
	}

    /**
     * @name parseRequest
     * @access public
     * @type {Function}
     *
     * @description parses the bytes of a DNS message to populate a model representing the message.
     *
     * @param {Array<Uint8>} name description
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
	}

	return {
		getHeader: getHeader,
		getQuestions: getQuestions,
		getAnswers: getAnswers,
		getNameservers: getNameservers,
		getAdditionalResources: getAdditionalResources,
		parseRequest: parseRequest,
		messageLength: messageLength
	};
};

module.exports = DNSMessage;
