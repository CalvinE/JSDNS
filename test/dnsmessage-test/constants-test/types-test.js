var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Types = require('../../../src/dnsmessage/constants/types');

/* global describe it:true */

describe('types', () => {
	it('Types.TYPES.length should be 20', () => {
		expect(Types.TYPES.length).to.be.equal(20);
	});
	it('Types.findTypeByName("A").value should be 1', () => {
		expect(Types.findTypeByName('A').value).to.be.equal(1);
	});
	it('Types.findTypeByName("NS").value should be 2', () => {
		expect(Types.findTypeByName('NS').value).to.be.equal(2);
	});
	it('Types.findTypeByName("MD").value should be 3', () => {
		expect(Types.findTypeByName('MD').value).to.be.equal(3);
	});
	it('Types.findTypeByName("MF").value should be 4', () => {
		expect(Types.findTypeByName('MF').value).to.be.equal(4);
	});
	it('Types.findTypeByName("CNAME").value should be 5', () => {
		expect(Types.findTypeByName('CNAME').value).to.be.equal(5);
	});
	it('Types.findTypeByName("SOA").value should be 6', () => {
		expect(Types.findTypeByName('SOA').value).to.be.equal(6);
	});
	it('Types.findTypeByName("MB").value should be 7', () => {
		expect(Types.findTypeByName('MB').value).to.be.equal(7);
	});
	it('Types.findTypeByName("MG").value should be 8', () => {
		expect(Types.findTypeByName('MG').value).to.be.equal(8);
	});
	it('Types.findTypeByName("MR").value should be 9', () => {
		expect(Types.findTypeByName('MR').value).to.be.equal(9);
	});
	it('Types.findTypeByName("NULL").value should be 10', () => {
		expect(Types.findTypeByName('NULL').value).to.be.equal(10);
	});
	it('Types.findTypeByName("WKS").value should be 11', () => {
		expect(Types.findTypeByName('WKS').value).to.be.equal(11);
	});
	it('Types.findTypeByName("PTR").value should be 12', () => {
		expect(Types.findTypeByName('PTR').value).to.be.equal(12);
	});
	it('Types.findTypeByName("HINFO").value should be 13', () => {
		expect(Types.findTypeByName('HINFO').value).to.be.equal(13);
	});
	it('Types.findTypeByName("MINFO").value should be 14', () => {
		expect(Types.findTypeByName('MINFO').value).to.be.equal(14);
	});
	it('Types.findTypeByName("MX").value should be 15', () => {
		expect(Types.findTypeByName('MX').value).to.be.equal(15);
	});
	it('Types.findTypeByName("TXT").value should be 16', () => {
		expect(Types.findTypeByName('TXT').value).to.be.equal(16);
	});
	it('Types.findTypeByName("AXFR").value should be 252', () => {
		expect(Types.findTypeByName('AXFR').value).to.be.equal(252);
	});
	it('Types.findTypeByName("MAILB").value should be 253', () => {
		expect(Types.findTypeByName('MAILB').value).to.be.equal(253);
	});
	it('Types.findTypeByName("MAILA").value should be 254', () => {
		expect(Types.findTypeByName('MAILA').value).to.be.equal(254);
	});
	it('Types.findTypeByName("*").value should be 255', () => {
		expect(Types.findTypeByName('*').value).to.be.equal(255);
	});
	it('Types.findTypeByName("NOT A REAL TYPE") should be undefined', () => {
		// eslint-disable-next-line no-unused-expressions
		expect(Types.findTypeByName('NOT A REAL TYPE')).to.be.undefined;
	});
	it('Types.findTypeByValue(1).name should be "A"', () => {
		expect(Types.findTypeByValue(1).name).to.be.equal('A');
	});
	it('Types.findTypeByValue(2).name should be "NS"', () => {
		expect(Types.findTypeByValue(2).name).to.be.equal('NS');
	});
	it('Types.findTypeByValue(3).name should be "MD"', () => {
		expect(Types.findTypeByValue(3).name).to.be.equal('MD');
	});
	it('Types.findTypeByValue(4).name should be "MF"', () => {
		expect(Types.findTypeByValue(4).name).to.be.equal('MF');
	});
	it('Types.findTypeByValue(5).name should be "CNAME"', () => {
		expect(Types.findTypeByValue(5).name).to.be.equal('CNAME');
	});
	it('Types.findTypeByValue(6).name should be "SOA"', () => {
		expect(Types.findTypeByValue(6).name).to.be.equal('SOA');
	});
	it('Types.findTypeByValue(7).name should be "MB"', () => {
		expect(Types.findTypeByValue(7).name).to.be.equal('MB');
	});
	it('Types.findTypeByValue(8).name should be "MG"', () => {
		expect(Types.findTypeByValue(8).name).to.be.equal('MG');
	});
	it('Types.findTypeByValue(9).name should be "MR"', () => {
		expect(Types.findTypeByValue(9).name).to.be.equal('MR');
	});
	it('Types.findTypeByValue(10).name should be "NULL"', () => {
		expect(Types.findTypeByValue(10).name).to.be.equal('NULL');
	});
	it('Types.findTypeByValue(11).name should be "WKS"', () => {
		expect(Types.findTypeByValue(11).name).to.be.equal('WKS');
	});
	it('Types.findTypeByValue(12).name should be "PTR"', () => {
		expect(Types.findTypeByValue(12).name).to.be.equal('PTR');
	});
	it('Types.findTypeByValue(13).name should be "HINFO"', () => {
		expect(Types.findTypeByValue(13).name).to.be.equal('HINFO');
	});
	it('Types.findTypeByValue(14).name should be "MINFO"', () => {
		expect(Types.findTypeByValue(14).name).to.be.equal('MINFO');
	});
	it('Types.findTypeByValue(15).name should be "MX"', () => {
		expect(Types.findTypeByValue(15).name).to.be.equal('MX');
	});
	it('Types.findTypeByValue(16).name should be "TXT"', () => {
		expect(Types.findTypeByValue(16).name).to.be.equal('TXT');
	});
	it('Types.findTypeByValue(252).name should be "AXFR"', () => {
		expect(Types.findTypeByValue(252).name).to.be.equal('AXFR');
	});
	it('Types.findTypeByValue(253).name should be "MAILB"', () => {
		expect(Types.findTypeByValue(253).name).to.be.equal('MAILB');
	});
	it('Types.findTypeByValue(254).name should be "MAILA"', () => {
		expect(Types.findTypeByValue(254).name).to.be.equal('MAILA');
	});
	it('Types.findTypeByValue(255).name should be "*"', () => {
		expect(Types.findTypeByValue(255).name).to.be.equal('*');
	});
	it('Types.findTypeByValue(99) should be undefined', () => {
		// eslint-disable-next-line no-unused-expressions
		expect(Types.findTypeByValue(99)).to.be.undefined;
	});
});
