var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require('../../src/dnsmessage/dnsheader');

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

function getTestQuestionDNSPacketBuffer () {
	return Buffer.from(testQuestionDNSPacket.slice());
}

function getTestResponseDNSPacketBuffer () {
	return Buffer.from(testResponseDNSPacket.slice());
}

/* global describe it:true */

describe('dns-header', () => {
	it('When decoding the test question above using the DNSHeader class should set the header length to the length of a DNS header section.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.headerLength).to.equal(0x0C);
	});
	it('The DNSHeader class should generate a random id less than or equal to 0xFFFF and greater than or equal to 0x0001', () => {
		for (let i = 0; i < 1000000; i++) {
			var id = DNSHeader.generateRandomID();
			expect(id).to.be.at.least(0x0001);
			expect(id).to.be.at.most(0xFFFF);
		}
	});
  // Question
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the ID field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.id).to.equal(0xb16a);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the QR field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.qr).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the Opcode field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.opcode.value).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the AA field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.aa).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the TC field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.tc).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the RD field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.rd).to.equal(0x01);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the RA field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.ra).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the Z field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.z).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the Rcode field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.rcode.value).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the QDcount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.qdcount).to.equal(0x01);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the ANcount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.ancount).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the NScount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.nscount).to.equal(0x00);
	});
	it('When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the ARcount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(header.arcount).to.equal(0x00);
	});
  // Response
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the ID field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.id).to.equal(0xb16a);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the QR field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.qr).to.equal(0x01);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the Opcode field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.opcode.value).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the AA field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.aa).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the TC field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.tc).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the RD field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.rd).to.equal(0x01);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the RA field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.ra).to.equal(0x01);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the Z field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.z).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the Rcode field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.rcode.value).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the QDcount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.qdcount).to.equal(0x01);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the ANcount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.ancount).to.equal(0x01);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the NScount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.nscount).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the ARcount field.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.arcount).to.equal(0x00);
	});
	it('When decoding the test response above using the DNSHeader class should decode the byte array of the response above and the resulting headers length should be 12 per the DNS RFC.', () => {
		let header = new DNSHeader();
		header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
		expect(header.headerLength).to.equal(12);
	});
	it('When encoding the test response above using the DNSHeader class should encode the byte array of the response above and the resulting headers length should be 12 per the DNS RFC.', () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		expect(encodedHeader.headerLength).to.equal(12);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical id values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.id).to.equal(decodedHeader.id);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical qr values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.qr).to.equal(decodedHeader.qr);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical opcode values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.opcode).to.equal(decodedHeader.opcode);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical aa values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.aa).to.equal(decodedHeader.aa);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical tc values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.tc).to.equal(decodedHeader.tc);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical rd values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.rd).to.equal(decodedHeader.rd);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical ra values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.ra).to.equal(decodedHeader.ra);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical z values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.z).to.equal(decodedHeader.z);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical rcode values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.rcode).to.equal(decodedHeader.rcode);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical qdcount values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.qdcount).to.equal(decodedHeader.qdcount);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical ancount values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.ancount).to.equal(decodedHeader.ancount);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical nscount values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.nscount).to.equal(decodedHeader.nscount);
	});
	it("Encoding message header with same parameters as the sample query's header above should result both having identical arcount values.", () => {
		let encodedHeader = new DNSHeader();
		let headerData = {
			id: 45418,
			qr: 0,
			opcode: 0,
			aa: 0,
			tc: 0,
			rd: 1,
			ra: 0,
			z: 0,
			rcode: 0,
			qdcount: 1,
			ancount: 0,
			nscount: 0,
			arcount: 0
		};
		encodedHeader.encodeHeaderForMessage(headerData);
		let decodedHeader = new DNSHeader();
		decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
		expect(encodedHeader.arcount).to.equal(decodedHeader.arcount);
	});
});
