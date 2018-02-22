var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require('../../src/dnsmessage/dnsheader');
var DNSQuestion = require('../../src/dnsmessage/dnsquestion');

const testQuestionDNSPacket = [0xb1, 0x6a, // Id
	0x01, 0x00, // Flags
	0x00, 0x01, // Questions count
	0x00, 0x00, // Answers count
	0x00, 0x00, // Authority RR count
	0x00, 0x00, // Additional RR count
                               // Queries
	0x03, 0x77, 0x77, 0x77, 0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00, // Domain name
	0x00, 0x01, // Type
	0x00, 0x01]; // Class

function getTestQuestionDNSPacketBuffer () {
	return Buffer.from(testQuestionDNSPacket.slice());
}

/* global describe it:true */

describe('dns-question', () => {
	it('When decoding the test question above using the DNSQuestion class the getQuestionLength method should return the same value as testQuestionDNSPacket.length because there is only one question and after parsing it offset should be the same as the length of the message.', () => {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let data = getTestQuestionDNSPacketBuffer();
		var offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.headerLength;
		question.decodeDNSQuestionFromMessage(data, header.headerLength);
		offset += question.questionLength;
		expect(offset).to.equal(testQuestionDNSPacket.length);
	});
	it('When decoding the test question above using the DNSQuestion class should decode the byte array of the question above and populate the QClass field.', () => {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let data = getTestQuestionDNSPacketBuffer();
		header.decodeDNSHeaderFromMessage(data);
		question.decodeDNSQuestionFromMessage(data, header.headerLength);
		expect(question.qclass.value).to.equal(0x01);
	});
	it('When decoding the test question above using the DNSQuestion class should decode the byte array of the question above and populate the QType field.', () => {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let data = getTestQuestionDNSPacketBuffer();
		header.decodeDNSHeaderFromMessage(data);
		question.decodeDNSQuestionFromMessage(data, header.headerLength);
		expect(question.qtype.value).to.equal(0x01);
	});
	it('When encoding a test question using the DNSQuestion class the name should be encoded properly to match the name in the test question above.', () => {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let data = getTestQuestionDNSPacketBuffer();
		header.decodeDNSHeaderFromMessage(data);
		question.decodeDNSQuestionFromMessage(data, header.headerLength);
		let encodedQuestion = new DNSQuestion();
		encodedQuestion.encodeQuestionForMessage({
			qname: 'www.google.com',
			qtype: 1,
			qclass: 1
		});
		expect(question.qname).to.equal(encodedQuestion.qname);
	});
});
