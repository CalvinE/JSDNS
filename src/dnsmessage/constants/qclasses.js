/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 *
 * Implemented from RFC 1035 3.2.4 CLASS values and 3.2.5 QCLASS values
 */

module.exports = [
    // CLASS values
	{
		'value': 1,
		'name': 'IN',
		'description': 'the Internet'
	},
	{
		'value': 2,
		'name': 'CS',
		'description': 'the CSNET class (Obsolete - used only for examples in some obsolete RFCs)'
	},
	{
		'value': 3,
		'name': 'CH',
		'description': 'the CHAOS class'
	},
	{
		'value': 4,
		'name': 'HS',
		'description': 'Hesiod [Dyer 87]'
	},
    // QCLASS values
	{
		'value': 255,
		'name': '*',
		'description': 'any class'
	}
];
