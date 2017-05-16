/*
 * Created on Fri May 12 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const dgram = require('dgram');
let DNSMessage = require('../dnsmessage/dnsmessage');
let Utilities = require('../utilities');

/**
 * @name ResolverUtilities
 * @access public
 * @class
 *
 * @description This is where common functions used by resolvers live!
 */
function ResolverUtilities () {
	/**
	 * @name sendDNSUDPDatagram
	 * @access privte
	 * @function
	 *
	 * @description A general purpose method for sending UDP datagrams to other name servers.
	 *
	 * @param {Buffer} queryBuffer The raw DNS request data to send via UDP.
	 * @param {string} destinationAddress The address to send the UDP DNS datagram.
	 * @param {number} destinationPort The port to send the UDP DNS datagram.
	 *
	 * @returns {Promise} A promise that is resolved when the request is complete successful or not.
	 */
	function sendDNSUDPDatagram (queryBuffer, destinationAddress, destinationPort = 53) {
		return new Promise(function (resolve, reject) {
			let response = null;
			let client = dgram.createSocket('udp4');
			// client.on('listening', function () {
			// 	let address = client.address();
			// 	console.log('UDP Server listening on ' + address.address + ':' + address.port);
			// });

			client.on('message', function (message, remote) {
				// console.log(remote.address + ':' + remote.port + ' - ' + message);
				try {
					response = new DNSMessage();
					response.parseRequest(message);
					resolve(response);
					client.close();
				} catch (e) {
					reject(e);
				}
			});

			client.send(Buffer.from(queryBuffer), destinationPort, destinationAddress, (err) => { // TODO: implement this in a way that cycles through forwarders until either a result is found or we run out...
				if (Utilities.isNullOrUndefined(err) === false) {
					reject(err);
				}
			});
		});
	};

	return {
		sendDNSUDPDatagram: sendDNSUDPDatagram
	};
}

module.exports = ResolverUtilities();
