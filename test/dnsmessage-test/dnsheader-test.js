var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var DNSHeader = require("../../src/dnsmessage/dnsheader");

let header = new DNSHeader();

describe('dns-header', function() {
  it('header.generateRandomID() should generate a random id less than or equal to 0xFFFF', function() {
    var id = header.generateRandomID()
    expect(id).to.be.at.most(0xFFFF);
  });
});