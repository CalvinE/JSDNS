# JSDNS

## This is a project I just came up with one day where I was like "Hey you know what would be cool? Reading a bunch of RFCs and writing a DNS server, oh and Ill do it all in Node.js"

The goal is to end up with a fully compliant with the specs DNS server. This project is till in the begenning stages, so I am working from the Base RFCs for the spec RFC 1034 and RFC 1035. I am not implmenting things I know are obsolete from the current standard.

Once I get a little further along I will add instructions to this document to get this running on your machine.

## Known TODO list
* Get message compression working in the resolver using the existing DNSUtilities method.
* Get all functionality related to the TC header flag working.
* Get TCP working for zone transfers.
* Get TCP working for other query types.
* Get inverse queries working.
* Add security around zone transfers with easy configurability.
* More will undoubtedly be added as I read future RFCs.