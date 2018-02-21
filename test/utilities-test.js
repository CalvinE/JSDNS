var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Utilities = require('../src/utilities');

/* global describe it:true */

describe('utilities', () => {
	it('When encoding a 16 bit number the result should be accurate.', () => {
		let testValue = 0xBEEF;
		let calculatedResult = Utilities.encode16BitValue(testValue);
		let expectedResult = [0xBE, 0xEF];
		for (let i = 0; i < calculatedResult.length; i++) {
			expect(calculatedResult[i]).to.equal(expectedResult[i]);
		}
	});
	it('When decoding a 16 bit number the result should be accurate.', () => {
		let testValue = [0xBE, 0xEF];
		let calculatedResult = Utilities.decode16BitValue(testValue[0], testValue[1]);
		let expectedResult = 0xBEEF;
		expect(calculatedResult).to.equal(expectedResult);
	});
	it('When encoding a 32 bit number the result should be accurate.', () => {
		let testValue = 0xDEADBEEF;
		let calculatedResult = Utilities.encode32BitValue(testValue);
		let expectedResult = [0xDE, 0xAD, 0xBE, 0xEF];
		for (let i = 0; i < calculatedResult.length; i++) {
			expect(calculatedResult[i]).to.equal(expectedResult[i]);
		}
	});
	it('When decoding a 32 bit number the result should be accurate.', () => {
		let testValue = [0xDE, 0xAD, 0xBE, 0xEF];
		let calculatedResult = Utilities.decode32BitValue(testValue[0], testValue[1], testValue[2], testValue[3]);
		let expectedResult = 0xDEADBEEF;
		expect(calculatedResult).to.equal(expectedResult);
	});
});
