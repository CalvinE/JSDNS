var chai = require("chai");
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require("../../src/dnsmessage/dnsheader");

const testQuestionDNSPacket = [0xb1, 0x6a, //Id
                               0x01, 0x00, //Flags
                               0x00, 0x01, //Questions count
                               0x00, 0x00, //Answers count
                               0x00, 0x00, //Authority RR count
                               0x00, 0x00, //Additional RR count
                               //Queries
                               0x03, 0x77, 0x77, 0x77, 0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00, //Domain name
                               0x00, 0x01, //Type
                               0x00, 0x01]; //Class

const testResponseDNSPacket = [0xb1, 0x6a, //Id
                               0x81, 0x80, //Flags
                               0x00, 0x01, //Questions count
                               0x00, 0x01, //Answers count
                               0x00, 0x00,//Authority RR count
                               0x00, 0x00, //Additional RR count
                               //Queries
                               0x03, 0x77, 0x77, 0x77, 0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00, //Domain name
                               0x00, 0x01, //Type
                               0x00, 0x01, //Class
                               //Answers
                               0xc0, 0x0c, //Domain name (compressed)
                               0x00, 0x01, //Type
                               0x00, 0x01, //Class
                               0x00, 0x00, 0x00, 0x9a, //Time to live
                               0x00, 0x04, //RData Length
                               0xac, 0xd9, 0x00, 0x04]; //RData

function getTestQuestionDNSPacketBuffer(){
  return Buffer.from(testQuestionDNSPacket.slice());
}

function getTestResponseDNSPacketBuffer(){
  return Buffer.from(testResponseDNSPacket.slice());
}

describe("dns-header", function() {
  it("When decoding the test question above using the DNSHeader class should set the header length to the length of a DNS header section.", function(){
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getHeaderLength()).to.equal(0x0C);
  });
  it("The DNSHeader class should generate a random id less than or equal to 0xFFFF and greater than or equal to 0x0001", function() {
    let header = new DNSHeader();
    for(let i = 0; i < 1000000; i++){
      var id = header.generateRandomID()
      expect(id).to.be.at.least(0x0001);
      expect(id).to.be.at.most(0xFFFF);
    }
  });
  //Question
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the ID field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getId()).to.equal(0xb16a);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the QR field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getQr()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the Opcode field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getOpcode().value).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the AA field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getAa()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the TC field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getTc()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the RD field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getRd()).to.equal(0x01);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the RA field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getRa()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the Z field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getZ()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the Rcode field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getRcode().value).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the QDcount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getQdcount()).to.equal(0x01);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the ANcount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getAncount()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the NScount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getNscount()).to.equal(0x00);
  });
  it("When decoding the test question above using the DNSHeader class should decode the byte array of the question above and populate the ARcount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getArcount()).to.equal(0x00);
  });
  //Response
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the ID field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getId()).to.equal(0xb16a);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the QR field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getQr()).to.equal(0x01);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the Opcode field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getOpcode().value).to.equal(0x00);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the AA field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getAa()).to.equal(0x00);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the TC field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getTc()).to.equal(0x00);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the RD field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getRd()).to.equal(0x01);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the RA field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getRa()).to.equal(0x01);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the Z field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getZ()).to.equal(0x00);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the Rcode field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getRcode().value).to.equal(0x00);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the QDcount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getQdcount()).to.equal(0x01);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the ANcount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getAncount()).to.equal(0x01);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the NScount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getNscount()).to.equal(0x00);
  });
  it("When decoding the test response above using the DNSHeader class should decode the byte array of the response above and populate the ARcount field.", function() {
    let header = new DNSHeader();
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getArcount()).to.equal(0x00);
  });
  it("Encoding message header with same parameters as the sample query's header above should result in identical properties..", function(){
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
    let decodedHeader = new DNSHeader()
    decodedHeader.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(encodedHeader.getId()).to.equal(decodedHeader.getId());
    expect(encodedHeader.getQr()).to.equal(decodedHeader.getQr());
    expect(encodedHeader.getOpcode()).to.equal(decodedHeader.getOpcode());
    expect(encodedHeader.getAa()).to.equal(decodedHeader.getAa());
    expect(encodedHeader.getTc()).to.equal(decodedHeader.getTc());
    expect(encodedHeader.getRd()).to.equal(decodedHeader.getRd());
    expect(encodedHeader.getRa()).to.equal(decodedHeader.getRa());
    expect(encodedHeader.getZ()).to.equal(decodedHeader.getZ());
    expect(encodedHeader.getRcode()).to.equal(decodedHeader.getRcode());
    expect(encodedHeader.getQdcount()).to.equal(decodedHeader.getQdcount());
    expect(encodedHeader.getAncount()).to.equal(decodedHeader.getAncount());
    expect(encodedHeader.getNscount()).to.equal(decodedHeader.getNscount());
    expect(encodedHeader.getArcount()).to.equal(decodedHeader.getArcount());
  });
});