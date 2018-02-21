/*
 * Created on Sun Apr 23 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
let Logger = require('../../src/logging/logger');

/* global describe it:true */

describe('logger', () => {
	it('Logger should be able to log string messages.', () => {
		let errorOccurred = false;
		try {
			Logger.log('This is a logging test', Logger.logTypes.debug);
			Logger.log('This is a logging test', Logger.logTypes.debug);
			Logger.log('This is a logging test', Logger.logTypes.debug);
			Logger.flushLogQueue();
		} catch (e) {
			errorOccurred = true;
		}
		expect(errorOccurred).to.equal(false);
	});
	it('Logger should be able to log JSON object messages.', () => {
		let errorOccurred = false;
		try {
			Logger.log({'code': 1, 'msg': 'this is a test'}, Logger.logTypes.debug);
			Logger.log({'code': 1, 'msg': 'this is a test'}, Logger.logTypes.debug);
			Logger.log({'code': 1, 'msg': 'this is a test'}, Logger.logTypes.debug);
			Logger.flushLogQueue();
		} catch (e) {
			errorOccurred = true;
		}
		expect(errorOccurred).to.equal(false);
	});
});
