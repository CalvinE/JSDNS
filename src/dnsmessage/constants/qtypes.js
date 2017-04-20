/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 *
 * Implemented from RFC 1035 3.2.2 TYPE values and 3.2.3 QTYPE values
 */

module.exports = [
    // TYPE values
	{
		'value': 1,
		'name': 'A',
		'description': '//A host address'
	},
	{
		'value': 2,
		'name': 'NS',
		'description': 'an authoritative name server'
	},
	{
		'value': 3,
		'name': 'MD',
		'description': 'a mail destination (Obsolete - use MX)'
	},
	{
		'value': 4,
		'name': 'MF',
		'description': 'a mail forwarder (Obsolete - use MX)'
	},
	{
		'value': 5,
		'name': 'CNAME',
		'description': 'the canonical name for an alias'
	},
	{
		'value': 6,
		'name': 'SOA',
		'description': 'marks the start of a zone of authority'
	},
	{
		'value': 7,
		'name': 'MB',
		'description': 'a mailbox domain name (EXPERIMENTAL)'
	},
	{
		'value': 8,
		'name': 'MG',
		'description': 'a mail group member (EXPERIMENTAL)'
	},
	{
		'value': 9,
		'name': 'MR',
		'description': 'a mail rename domain name (EXPERIMENTAL)'
	},
	{
		'value': 10,
		'name': 'NULL',
		'description': 'a null RR (EXPERIMENTAL)'
	},
	{
		'value': 11,
		'name': 'WKS',
		'description': 'a well known service description'
	},
	{
		'value': 12,
		'name': 'PTR',
		'description': 'a domain name pointer'
	},
	{
		'value': 13,
		'name': 'HINFO',
		'description': 'host information'
	},
	{
		'value': 14,
		'name': 'MINFO',
		'description': 'mailbox or mail list information'
	},
	{
		'value': 15,
		'name': 'MX',
		'description': 'mail exchange'
	},
	{
		'value': 16,
		'name': 'TXT',
		'description': 'text strings'
	},
    // QTYPE values
	{
		'value': 252,
		'name': 'AXFR',
		'description': 'A request for a transfer of an entire zone'
	},
	{
		'value': 253,
		'name': 'MAILB',
		'description': 'A request for mailbox-related records (MB, MG or MR)'
	},
	{
		'value': 254,
		'name': 'MAILA',
		'description': 'A request for mail agent RRs (Obsolete - see MX)'
	},
	{
		'value': 255,
		'name': '*',
		'description': 'A request for all records'
	}
];
