var chai = require("chai");
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require("../../src/dnsmessage/dnsheader");

let header = new DNSHeader();

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
                               0xc0, 0x0c, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x9a, 0x00, 0x04, 0xac, 0xd9, 0x00, 0x04];

function getTestQuestionDNSPacketBuffer(){
  return Buffer.from(testQuestionDNSPacket.slice());
}

function getTestResponseDNSPacketBuffer(){
  return Buffer.from(testResponseDNSPacket.slice());
}

describe("dns-header", function() {
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should return a byte array the length of the original message minus the header length.", function(){
    var dataOrigionalLength = testQuestionDNSPacket.length;
    var dataMinusHeader = header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    let postParsingLength = dataOrigionalLength - 0x0C;
    expect(dataMinusHeader.length).to.equal(postParsingLength);
  });
  it("header.generateRandomID() should generate a random id less than or equal to 0xFFFF", function() {
    var id = header.generateRandomID()
    expect(id).to.be.at.most(0xFFFF);
  });
  //Query
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the ID field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getId()).to.equal(0xb16a);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the QR field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getQr()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the Opcode field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getOpcode().value).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the AA field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getAa()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the TC field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getTc()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the RD field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getRd()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the RA field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getRa()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the Z field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getZ()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the Rcode field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getRcode().value).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the QDcount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getQdcount()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the ANcount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getAncount()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the NScount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getNscount()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a query above and populate the ARcount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestQuestionDNSPacketBuffer());
    expect(header.getArcount()).to.equal(0x00);
  });
  //Response
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the ID field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getId()).to.equal(0xb16a);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the QR field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getQr()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the Opcode field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getOpcode().value).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the AA field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getAa()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the TC field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getTc()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the RD field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getRd()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the RA field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getRa()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the Z field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getZ()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the Rcode field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getRcode().value).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the QDcount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getQdcount()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the ANcount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getAncount()).to.equal(0x01);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the NScount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getNscount()).to.equal(0x00);
  });
  it("header.decodeDNSHeaderFromMessage(testDNSPacket) should decode the byte array of a response above and populate the ARcount field.", function() {
    header.decodeDNSHeaderFromMessage(getTestResponseDNSPacketBuffer());
    expect(header.getArcount()).to.equal(0x00);
  });
});