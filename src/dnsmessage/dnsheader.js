/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const OPCODES = require("../dnsmessage/constants/opcodes");
const RCODES = require("../dnsmessage/constants/rcodes");

function DNSMesageHeader(){
    let id = null; //A 16 bit identifier assigned by the program that generates any kind of query.  This identifier is copied the corresponding reply and can be used by the requester to match up replies to outstanding queries.
    let qr = null; //A one bit field that specifies whether this message is a query (0), or a response (1).
    let opcode = null; //A four bit field that specifies kind of query in this message.  This value is set by the originator of a query and copied into the response.
    let aa = null; //Authoritative Answer - this bit is valid in responses, and specifies that the responding name server is an authority for the domain name in question section. Note that the contents of the answer section may have multiple owner names because of aliases.  The AA bitcorresponds to the name which matches the query name, or the first owner name in the answer section.
    let tc = null; //TrunCation - specifies that this message was truncated due to length greater than that permitted on the transmission channel.
    let rd = null; //Recursion Desired - this bit may be set in a query and is copied into the response.  If RD is set, it directs the name server to pursue the query recursively. Recursive query support is optional.
    let ra = null; //Recursion Available - this be is set or cleared in a response, and denotes whether recursive query support is available in the name server.
    let z = 0; //Reserved for future use.  Must be zero in all queries and responses.
    let rcode = null; //Response code - this 4 bit field is set as part of responses. 
    let qdcount = null; //an unsigned 16 bit integer specifying the number of entries in the question section.
    let ancount = null; //an unsigned 16 bit integer specifying the number of resource records in the answer section.
    let nscount = null; //an unsigned 16 bit integer specifying the number of name server resource records in the authority records section.
    let arcount = null; //an unsigned 16 bit integer specifying the number of resource records in the additional records section.
    let headerLength = null; // This is the length in bytes of the header.

    function getId(){
        return id;
    }

    function setId(_id){
        id = _id;
    }

    function decodeId(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    function getQr(){
        return qr;
    }

    function setQr(_qr){
        qr = _qr;
    }
    
    function decodeQr(byte){
        return (byte & 0x80) != 0x00 ? 0x01 : 0x00
    }

    function getOpcode(){
        return opcode;
    }

    function setOpcode(_opcode){
        if(_opcode.value == undefined){
            _opcode = OPCODES.find(function(item){
                return item.value == parseInt(_opcode);
            });
        }
        opcode = _opcode;
    }

    function decodeOpcode(byte){
        return ((byte & 0x78) << 3);
    }

    function getAa(){
        return aa;
    }

    function setAa(_aa){
        aa = _aa;
    }

    function decodeAa(byte){
        return (byte & 0x04) != 0x00 ? 0x01 : 0x00
    }

    function getTc(){
        return tc;
    }

    function setTc(_tc){
        tc = _tc;
    }

    function decodeTc(byte){
        return (byte & 0x02) != 0x00 ? 0x01 : 0x00
    }

    function getRd(){
        return rd;
    }

    function setRd(_rd){
        rd = _rd;
    }

    function decodeRd(byte){
        return (byte & 0x01) != 0x00 ? 0x01 : 0x00
    }

    function getRa(){
        return ra;
    }

    function setRa(_ra){
        ra = _ra;
    }

    function decodeRa(byte){
        return (byte & 0x80) != 0x00 ? 0x01 : 0x00
    }

    function getZ(){
        return z;
    }

    function setZ(_z){
        z = _z;
        throw "z cannot be set. it must always be 0 per RFC 1035";
    }

    function getRcode(){
        return rcode;
    }

    function setRcode(_rcode){
        if(_rcode.value == undefined){
            _rcode = RCODES.find(function(item){
                return item.value == parseInt(_rcode);
            });
        }
        rcode = _rcode;
    }

    function decodeRcode(byte){
        return 0x0F & byte;
    }

    function getQdcount(){
        return qdcount;
    }

    function setQdcount(_qdcount){
        qdcount = _qdcount
    }

    function decodeQdcount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    function getAncount(){
        return ancount;
    }

    function setAncount(_ancount){
        ancount = _ancount
    }

    function decodeAncount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    function getNscount(){
        return nscount;
    }

    function setNscount(_nscount){
        nscount = _nscount;
    }

    function decodeNscount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    function getArcount(){
        return arcount;
    }

    function setArcount(_arcount){
        arcount = _arcount;
    }

    function decodeArcount(highByte, lowByte){
        return ((highByte << 8) | lowByte);
    }

    function getHeaderLength(){
        return headerLength;
    }
    
    function setHeaderLength(length){
        headerLength = length;
    }
    /**
     * 
     * 
     * @param {any} data - This is the complete message from the as an array of bytes.
     */
    function decodeDNSHeaderFromMessage(data){
        let index = 0;
        setId(decodeId(data[index++], data[index++]));
        let flagHighByte = data[index++];
        let flagLowByte = data[index++];
        setQr(decodeQr(flagHighByte));
        setOpcode(decodeOpcode(flagHighByte));
        setAa(decodeAa(flagHighByte));
        setTc(decodeTc(flagHighByte));
        setRd(decodeRd(flagHighByte));
        setRa(decodeRa(flagLowByte));      
        //We do not deoce the Z value because it is always 0 per RFC 1035 4.1.1
        setRcode(decodeRcode(flagLowByte));  
        setQdcount(decodeQdcount(data[index++], data[index++]));
        setAncount(decodeAncount(data[index++], data[index++]));
        setNscount(decodeNscount(data[index++], data[index++]));
        setArcount(decodeArcount(data[index++], data[index++]));
        setHeaderLength(index);
    }

    function encodeHeaderForMessage(){

    }

    function generateRandomID(){
        return Math.floor(Math.random() * (0xFFFF - 0x00)) + 0x00;
    }

    return{
        getId: getId,
        setId: setId,
        getQr: getQr,
        setQr: setQr,
        getOpcode: getOpcode,
        setOpcode: setOpcode,
        getAa: getAa,
        setAa: setAa,
        getTc: getTc,
        setTc: setTc,
        getRd: getRd,
        setRd: setRd,
        getRa: getRa,
        setRa: setRa,
        getZ: getZ,
        setZ: setZ,
        getRcode: getRcode,
        setRcode: setRcode,
        getQdcount: getQdcount,
        setQdcount: setQdcount,
        getAncount: getAncount,
        setAncount: setAncount,
        getNscount: getNscount,
        setNscount: setNscount,
        getArcount: getArcount,
        setArcount: setArcount,
        getHeaderLength: getHeaderLength,
        decodeDNSHeaderFromMessage: decodeDNSHeaderFromMessage,
        generateRandomID: generateRandomID
    };

}

module.exports = DNSMesageHeader;