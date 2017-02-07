var chai = require("chai");
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require("../../src/dnsmessage/dnsheader");
var DNSQuestion = require("../../src/dnsmessage/dnsquestion");
var DNSResourceRecord = require("../../src/dnsmessage/dnsresourcerecord");

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

function getTestResponseDNSPacketBuffer(){
  return Buffer.from(testResponseDNSPacket.slice());
}

describe("dns-resourcerecord", function() {
  it("While parsing a dns response the bytes parsed should equal the length of the message.", function() {
    let header = new DNSHeader();
    let question = new DNSQuestion();
    let resourceRecord = new DNSResourceRecord();
    let data = getTestResponseDNSPacketBuffer();
    var offset = 0;
    header.decodeDNSHeaderFromMessage(data)
    offset += header.getHeaderLength();
    question.decodeDNSQuestionFromMessage(data, header.getHeaderLength());
    offset += question.getQuestionLength();
    resourceRecord.decodeDNSResourceRecordFromMessage(data, offset);
    offset += resourceRecord.getResourceRecordLength();
    expect(offset).to.equal(testResponseDNSPacket.length);
  });
});