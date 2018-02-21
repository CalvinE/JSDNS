var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var RCodes = require('../../../src/dnsmessage/constants/rcodes');

/* global describe it:true */

describe('rcodes', () => {
	it('RCodes.RESPONSE_CODES.length should be 6', () => {
		expect(RCodes.RESPONSE_CODES.length).to.be.equal(6);
	});
	it('RCodes.findRCodeByValue(0).title should be "Success"', () => {
		expect(RCodes.findRCodeByValue(0).title).to.be.equal('Success');
	});
	it('RCodes.findRCodeByValue(1).title should be "Format error"', () => {
		expect(RCodes.findRCodeByValue(1).title).to.be.equal('Format error');
	});
	it('RCodes.findRCodeByValue(2).title should be "Server failure"', () => {
		expect(RCodes.findRCodeByValue(2).title).to.be.equal('Server failure');
	});
	it('RCodes.findRCodeByValue(3).title should be "Name error"', () => {
		expect(RCodes.findRCodeByValue(3).title).to.be.equal('Name error');
	});
	it('RCodes.findRCodeByValue(4).title should be "Not implemented"', () => {
		expect(RCodes.findRCodeByValue(4).title).to.be.equal('Not implemented');
	});
	it('RCodes.findRCodeByValue(5).title should be "Refused"', () => {
		expect(RCodes.findRCodeByValue(5).title).to.be.equal('Refused');
	});
	it('RCodes.findRCodeByValue(99) should be undefined', () => {
		// eslint-disable-next-line no-unused-expressions
		expect(RCodes.findRCodeByValue(99)).to.be.undefined;
	});
});
