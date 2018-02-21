var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Classes = require('../../../src/dnsmessage/constants/classes');

/* global describe it:true */

describe('classes', () => {
	it('Classes.CLASSES.length should be 5', () => {
		expect(Classes.CLASSES.length).to.be.equal(5);
	});
	it('Classes.findClassByValue(1).name should be "IN"', () => {
		expect(Classes.findClassByValue(1).name).to.be.equal('IN');
	});
	it('Classes.findClassByValue(2).name should be "CS"', () => {
		expect(Classes.findClassByValue(2).name).to.be.equal('CS');
	});
	it('Classes.findClassByValue(3).name should be "CH"', () => {
		expect(Classes.findClassByValue(3).name).to.be.equal('CH');
	});
	it('Classes.findClassByValue(4).name should be "HS"', () => {
		expect(Classes.findClassByValue(4).name).to.be.equal('HS');
	});
	it('Classes.findClassByValue(255).name should be "*"', () => {
		expect(Classes.findClassByValue(255).name).to.be.equal('*');
	});
	it('Classes.findClassByName("IN").value should be "1"', () => {
		expect(Classes.findClassByName('IN').value).to.be.equal(1);
	});
	it('Classes.findClassByName("CS").value should be "2"', () => {
		expect(Classes.findClassByName('CS').value).to.be.equal(2);
	});
	it('Classes.findClassByName("CH").value should be "3"', () => {
		expect(Classes.findClassByName('CH').value).to.be.equal(3);
	});
	it('Classes.findClassByName("HS").value should be "4"', () => {
		expect(Classes.findClassByName('HS').value).to.be.equal(4);
	});
	it('Classes.findClassByName("*").value should be "255"', () => {
		expect(Classes.findClassByName('*').value).to.be.equal(255);
	});
	it('Classes.findClassByValue(99) should be undefined', () => {
		// eslint-disable-next-line no-unused-expressions
		expect(Classes.findClassByValue(99)).to.be.undefined;
	});
	it('Classes.findClassByName("NOTREAL") should be undefined', () => {
		// eslint-disable-next-line no-unused-expressions
		expect(Classes.findClassByName('NOTREAL')).to.be.undefined;
	});
});
