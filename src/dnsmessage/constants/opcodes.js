/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 *
 * Implemented from RFC 1035 4.1.1 OPCODE values
 */

module.exports = [
	{
		'value': 0,
		'description': 'a standard query (QUERY)'
	},
	{
		'value': 1,
		'description': 'an inverse query (IQUERY)'
	},
	{
		'value': 2,
		'description': 'a server status request (STATUS)'
	}
    // 3-15 are reserved for future use per RFC 1035.
];
