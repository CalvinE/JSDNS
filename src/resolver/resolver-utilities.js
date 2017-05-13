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
	 * @name setMessageAsResponse
	 * @access public
	 * @function
	 *
	 * @description This function is used to set the appropriate header flags in the dns message to prepare it for returning to the client that sent it.
	 *
	 * @param {DNSMessage} dnsQuery The dns message to be modified for the return trip to the client.
	 * @param {Number} aa A 1 or 0 value to set the AA flag.
	 * @param {Number} tc A 1 or 0 value to set the TC flag.
	 * @param {Number} ra A 1 or 0 value to set the RA flag.
	 * @param {Number} rcode A valid rcode value.
	 *
	 * @return {DNSMessage} The modified message ready for the return trip!
	 */
	function setMessageAsResponse (dnsQuery, aa = 0, tc = 0, ra = 0, rcode = 0) {
		dnsQuery.getHeader().setQr(1); // Set header QR flag to 1 to indicate it is a response
		dnsQuery.getHeader().setAa(aa); // Set header AA Flag
		dnsQuery.getHeader().setTc(tc); // Set header TC Flag
		dnsQuery.getHeader().setRa(ra); // Set header RA flag
		dnsQuery.getHeader().setRcode(rcode); // Set header RCODE
		return dnsQuery;
	};

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
		setMessageAsResponse: setMessageAsResponse,
		sendDNSUDPDatagram: sendDNSUDPDatagram
	};
}

module.exports = ResolverUtilities();
