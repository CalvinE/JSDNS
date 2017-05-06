/*
 * Created on Sat Jan 28 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let DNSMessage = require('./src/dnsmessage/dnsmessage');
let Logger = require('./src/logging/logger');
let Resolver = require('./src/resolver/resolver');
let ResolverConfig = require('./src/jsdns-config.json').resolution;

// var queries = [
// 	[119, 121, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 108, 98, 7, 95, 100, 110, 115, 45, 115, 100, 4, 95, 117, 100, 112, 1, 48, 1, 48, 3, 49, 54, 56, 3, 49, 57, 50, 7, 105, 110, 45, 97, 100, 100, 114, 4, 97, 114, 112, 97, 0, 0, 12, 0, 1],
// 	[10, 101, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 50, 50, 1, 48, 3, 49, 54, 56, 3, 49, 57, 50, 7, 105, 110, 45, 97, 100, 100, 114, 4, 97, 114, 112, 97, 0, 0, 12, 0, 1],
// 	[153, 101, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 119, 119, 119, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[79, 96, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 119, 119, 119, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[205, 63, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 50, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[67, 42, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 50, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[234, 134, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[60, 132, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[20, 54, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 103, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[88, 163, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 103, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[29, 141, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[195, 228, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[172, 222, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13, 99, 111, 110, 102, 105, 103, 117, 114, 97, 116, 105, 111, 110, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[207, 146, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13, 99, 111, 110, 102, 105, 103, 117, 114, 97, 116, 105, 111, 110, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[108, 153, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10, 105, 110, 105, 116, 45, 112, 48, 49, 115, 116, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[223, 12, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10, 105, 110, 105, 116, 45, 112, 48, 49, 115, 116, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[116, 75, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[211, 254, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[238, 248, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 103, 115, 112, 101, 49, 45, 115, 115, 108, 2, 108, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[242, 230, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 103, 115, 112, 101, 49, 45, 115, 115, 108, 2, 108, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[29, 34, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 51, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[217, 253, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 51, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[237, 127, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 115, 101, 99, 117, 114, 101, 11, 108, 105, 118, 101, 99, 104, 97, 116, 105, 110, 99, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[87, 167, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 109, 116, 97, 108, 107, 6, 103, 111, 111, 103, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[255, 155, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 8, 117, 97, 102, 111, 120, 107, 104, 106, 0, 0, 1, 0, 1],
// 	[206, 199, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 113, 119, 102, 98, 119, 102, 111, 119, 100, 0, 0, 1, 0, 1],
// 	[101, 105, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10, 119, 118, 100, 120, 114, 105, 121, 115, 105, 119, 0, 0, 1, 0, 1],
// 	[119, 121, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 108, 98, 7, 95, 100, 110, 115, 45, 115, 100, 4, 95, 117, 100, 112, 1, 48, 1, 48, 3, 49, 54, 56, 3, 49, 57, 50, 7, 105, 110, 45, 97, 100, 100, 114, 4, 97, 114, 112, 97, 0, 0, 12, 0, 1],
// 	[10, 101, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 50, 50, 1, 48, 3, 49, 54, 56, 3, 49, 57, 50, 7, 105, 110, 45, 97, 100, 100, 114, 4, 97, 114, 112, 97, 0, 0, 12, 0, 1],
// 	[153, 101, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 119, 119, 119, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[79, 96, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 119, 119, 119, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[205, 63, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 50, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[67, 42, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 50, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[234, 134, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[60, 132, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[20, 54, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 103, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[88, 163, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 103, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[29, 141, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[195, 228, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[172, 222, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13, 99, 111, 110, 102, 105, 103, 117, 114, 97, 116, 105, 111, 110, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[207, 146, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13, 99, 111, 110, 102, 105, 103, 117, 114, 97, 116, 105, 111, 110, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[108, 153, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10, 105, 110, 105, 116, 45, 112, 48, 49, 115, 116, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[223, 12, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10, 105, 110, 105, 116, 45, 112, 48, 49, 115, 116, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[116, 75, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[211, 254, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 49, 45, 99, 111, 117, 114, 105, 101, 114, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[238, 248, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 103, 115, 112, 101, 49, 45, 115, 115, 108, 2, 108, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[242, 230, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 103, 115, 112, 101, 49, 45, 115, 115, 108, 2, 108, 115, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[29, 34, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 51, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[217, 253, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 51, 45, 99, 111, 117, 114, 105, 101, 114, 7, 115, 97, 110, 100, 98, 111, 120, 4, 112, 117, 115, 104, 5, 97, 112, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[255, 155, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 8, 117, 97, 102, 111, 120, 107, 104, 106, 0, 0, 1, 0, 1],
// 	[206, 199, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 113, 119, 102, 98, 119, 102, 111, 119, 100, 0, 0, 1, 0, 1],
// 	[101, 105, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10, 119, 118, 100, 120, 114, 105, 121, 115, 105, 119, 0, 0, 1, 0, 1],
// 	[114, 90, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 108, 111, 99, 97, 108, 0, 0, 6, 0, 1],
// 	[84, 251, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 103, 105, 116, 104, 117, 98, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[44, 93, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 103, 105, 116, 104, 117, 98, 3, 99, 111, 109, 0, 0, 28, 0, 1],
// 	[84, 251, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 103, 105, 116, 104, 117, 98, 3, 99, 111, 109, 0, 0, 1, 0, 1],
// 	[44, 93, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 103, 105, 116, 104, 117, 98, 3, 99, 111, 109, 0, 0, 28, 0, 1]
// ];

// let counter = 0;
// let start = new Date();
// for (let i = 0; i < queries.length; i++) {
// 	let d0 = new Date();
// 	let message = new DNSMessage();
// 	message.parseRequest(queries[i]);
// 	let d1 = new Date();
// 	Logger.log(`Message number: ${++counter}`);
// 	Logger.log(`Time to process DNS query was ${d1.getTime() - d0.getTime()} milliseconds.`);
// 	Logger.log(message.getQuestions()[0].getQname());
// 	Logger.log(message.getQuestions()[0].getQclass() || 'Class could not be parsed because it was not in our Classes file!');
// 	Logger.log(message.getQuestions()[0].getQtype() || 'Type could not be parsed because it was not in our Types file!');
// }
// let end = new Date();

// Logger.log(`Total time to process ${queries.length} DNS queries was ${end.getTime() - start.getTime()} milliseconds.`);

// Logger.log('Quitting test application in 5 seconds.');

// setTimeout(function () {
// 	process.exit(0);
// }, 5000);

let resolver = new Resolver();
resolver.init(ResolverConfig, {'find': function () { return null; }});
resolver.resolve();
