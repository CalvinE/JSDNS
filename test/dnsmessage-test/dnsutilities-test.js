var chai = require("chai");
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSUtilities = require("../../src/dnsmessage/dnsutilities");

const testNameData = [0xb1, 0x6a, //Id
                      0x81, 0x80, //Flags
                      0x00, 0x01, //Questions count
                      0x00, 0x01, //Answers count
                      0x00, 0x00,//Authority RR count
                      0x00, 0x00, //Additional RR count
                      //Queries
                      0x03, 0x77, 0x77, 0x77, 0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00, //Domain name
                      //Answers
                      0xc0, 0x0c, //Domain name (compressed)
                      0x05, 0x73, 0x77, 0x65, 0x65, 0x74, 0xc0, 0x0c];

function getTestQuestionDNSPacketBuffer(){
  return Buffer.from(testNameData.slice());
}

describe("dns-header", function() {
  it("When decoding names from the test data above all names should be present and correctly returned from the DNSUtilities class.", function(){
    let offset = 12;
    let data = getTestQuestionDNSPacketBuffer();
    let name1 = DNSUtilities.decodeName(data, offset);
    expect(name1.name.join(".")).to.equal("www.google.com");
  });
  it("When decoding names from the test data above the name that is just a compression pointer to another label should be present and correctly returned from the DNSUtilities class.", function(){
    let offset = 12;
    let data = getTestQuestionDNSPacketBuffer();
    let name1 = DNSUtilities.decodeName(data, offset);
    offset = name1.indexPosPostReading;
    let name2 = DNSUtilities.decodeName(data, offset);
    expect(name2.name.join(".")).to.equal("www.google.com");
  });
  it("When decoding names from the test data above the name that is a combination of a label and a compression pointer should be present and correctly returned from the DNSUtilities class.", function(){
    let offset = 12;
    let data = getTestQuestionDNSPacketBuffer();
    let name1 = DNSUtilities.decodeName(data, offset);
    offset = name1.indexPosPostReading;
    let name2 = DNSUtilities.decodeName(data, offset);
    offset = name2.indexPosPostReading;
    let name3 = DNSUtilities.decodeName(data, offset);
    expect(name3.name.join(".")).to.equal("sweet.www.google.com");
  });
});