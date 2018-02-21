var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var OPCodes = require('../../../src/dnsmessage/constants/opcodes');

/* global describe it:true */

describe('opcodes', () => {
	it('OPCodes.CODES.length should be 3', () => {
		expect(OPCodes.CODES.length).to.be.equal(3);
	});
	it('OPCodes.findOPCodeByValue(0).name should be "QUERY"', () => {
		expect(OPCodes.findOPCodeByValue(0).name).to.be.equal('QUERY');
	});
	it('OPCodes.findOPCodeByValue(1).name should be "IQUERY"', () => {
		expect(OPCodes.findOPCodeByValue(1).name).to.be.equal('IQUERY');
	});
	it('OPCodes.findOPCodeByValue(2).name should be "STATUS"', () => {
		expect(OPCodes.findOPCodeByValue(2).name).to.be.equal('STATUS');
	});
	it('OPCodes.findOPCodeByValue(99) should be undefined', () => {
		// eslint-disable-next-line no-unused-expressions
		expect(OPCodes.findOPCodeByValue(99)).to.be.undefined;
	});
});
