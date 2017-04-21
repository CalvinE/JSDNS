var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require('../../src/dnsmessage/dnsheader');
var DNSQuestion = require('../../src/dnsmessage/dnsquestion');
var DNSResourceRecord = require('../../src/dnsmessage/dnsresourcerecord');

const testResponseDNSPacket = [0xb1, 0x6a, // Id
	0x81, 0x80, // Flags
	0x00, 0x01, // Questions count
	0x00, 0x01, // Answers count
	0x00, 0x00, // Authority RR count
	0x00, 0x00, // Additional RR count
                               // Queries
	0x03, 0x77, 0x77, 0x77, 0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00, // Domain name
	0x00, 0x01, // Type
	0x00, 0x01, // Class
                               // Answers
	0xc0, 0x0c, // Domain name (compressed)
	0x00, 0x01, // Type
	0x00, 0x01, // Class
	0x00, 0x00, 0x00, 0x9a, // Time to live
	0x00, 0x04, // RData Length
	0xac, 0xd9, 0x00, 0x04]; // RData

function getTestResponseDNSPacketBuffer () {
	return Buffer.from(testResponseDNSPacket.slice());
}

/* global describe it:true */

describe('dns-resourcerecord', function () {
	it('When decoding the test response above using the DNSResourceRecord class the getResourceRecordLength method should return that when added together with the lengths of the DHSHeader and DHSQuestion the value should be equal to testResponseDNSPacket.length because that is the entire message.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		var offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, header.getHeaderLength());
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		expect(offset).to.equal(testResponseDNSPacket.length);
	});
	it('When decoding the test response above using the DNSResourceRecord class the name in the answer section should equal the name in the question section of the message..', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		var offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, header.getHeaderLength());
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		expect(question.getQname()).to.equal(resourceRecord.getName());
	});
	it('When decoding the test response above using the DNSResourceRecord class the type in the answer should equal the type in the query.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		var offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, header.getHeaderLength());
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		expect(question.getQtype()).to.equal(resourceRecord.getType());
	});
	it('When decoding the test response above using the DNSResourceRecord class the class in the answer should equal the class in the query.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		var offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, header.getHeaderLength());
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		expect(question.getQclass()).to.equal(resourceRecord.getRRclass());
	});
	it('When decoding the test response above using the DNSResourceRecord class the ttl should be parsed properly.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		var offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, header.getHeaderLength());
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		expect(resourceRecord.getTtl()).to.equal(0x9A);
	});
	it('When encoding a test response using the DNSResourceRecord class the Name should be encoded properly to match the Name in the test response above.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		let offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, offset);
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		let encodedResourceRecord = new DNSResourceRecord();
		encodedResourceRecord.encodeResourceRecordForMessage({
			name: 'www.google.com',
			type: 0x01,
			rrclass: 0x01,
			ttl: 0x9A,
			rdlength: 4,
			rdata: '172.217.0.4'
		});
		expect(resourceRecord.getName()).to.equal(encodedResourceRecord.getName());
	});
	it('When encoding a test response using the DNSResourceRecord class the Type should be encoded properly to match the Type in the test response above.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		let offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, offset);
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		let encodedResourceRecord = new DNSResourceRecord();
		encodedResourceRecord.encodeResourceRecordForMessage({
			name: 'www.google.com',
			type: 0x01,
			rrclass: 0x01,
			ttl: 0x9A,
			rdlength: 4,
			rdata: '172.217.0.4'
		});
		expect(resourceRecord.getType()).to.equal(encodedResourceRecord.getType());
	});
	it('When encoding a test response using the DNSResourceRecord class the RRclass should be encoded properly to match the RRclass in the test response above.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		let offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, offset);
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		let encodedResourceRecord = new DNSResourceRecord();
		encodedResourceRecord.encodeResourceRecordForMessage({
			name: 'www.google.com',
			type: 0x01,
			rrclass: 0x01,
			ttl: 0x9A,
			rdlength: 4,
			rdata: '172.217.0.4'
		});
		expect(resourceRecord.getRRclass()).to.equal(encodedResourceRecord.getRRclass());
	});
	it('When encoding a test response using the DNSResourceRecord class the RDLength should be encoded properly to match the RDLength in the test response above.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		let offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, offset);
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		let encodedResourceRecord = new DNSResourceRecord();
		encodedResourceRecord.encodeResourceRecordForMessage({
			name: 'www.google.com',
			type: 0x01,
			rrclass: 0x01,
			ttl: 0x9A,
			rdlength: 4,
			rdata: '172.217.0.4'
		});
		expect(resourceRecord.getRDLength()).to.equal(encodedResourceRecord.getRDLength());
	});
	it('When encoding a test response using the DNSResourceRecord class the RData should be encoded properly to match the RData in the test response above.', function () {
		let header = new DNSHeader();
		let question = new DNSQuestion();
		let resourceRecord = new DNSResourceRecord();
		let data = getTestResponseDNSPacketBuffer();
		let offset = 0;
		header.decodeDNSHeaderFromMessage(data);
		offset += header.getHeaderLength();
		question.decodeDNSQuestionFromMessage(data, offset);
		offset += question.getQuestionLength();
		resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
		offset += resourceRecord.getResourceRecordLength();
		let encodedResourceRecord = new DNSResourceRecord();
		encodedResourceRecord.encodeResourceRecordForMessage({
			name: 'www.google.com',
			type: 0x01,
			rrclass: 0x01,
			ttl: 0x9A,
			rdlength: 4,
			rdata: '172.217.0.4'
		});
		expect(resourceRecord.getRData()).to.equal(encodedResourceRecord.getRData());
	});
});
