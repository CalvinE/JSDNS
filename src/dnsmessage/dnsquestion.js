/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const QTYPES = require("../dnsmessage/constants/qtypes");
const QCLASSES = require("../dnsmessage/constants/qclasses");

function DNSMesageQuestion(){
    let qname = null; //a domain name represented as a sequence of labels, where each label consists of a length octet followed by that number of octets. The domain name terminates with the zero length octet for the null label of the root. Note that this field may be an odd number of octets; no padding is used.
    let qtype = null; //a two octet code which specifies the type of the query. The values for this field include all codes valid for a TYPE field, together with some more general codes which can match more than one type of RR.
    let qclass = null; //a two octet code that specifies the class of the query. For example, the QCLASS field is IN for the Internet.
    let questionStartIndex = null; // This is the absolute position in the byte array where this question begins.
    let questionLength = null; // This is the length of the question in bytes

    let index = 0;

    function getQname(){
        return qname;
    }

    function setQname(_qname){
        qname = _qname;
    }

    function decodeQname(qNameBytes){
        let qName = [];
        let length = qNameBytes[index++];
        while(length != 0x00){
            let qNamePart = "";
            for(var i = 0; i < length; i++){
                qNamePart += String.fromCharCode(qNameBytes[index++]);
            }
            qName.push(qNamePart);
            length = qNameBytes[index++];
        }
        return qName;
    }

    function getQtype(){
        return qtype;
    }

    function setQtype(_qtype){
        if(_qtype.value == undefined){
            _qtype = QTYPES.find(function(item){
                return item.value == parseInt(_qtype);
            });
        }
        qtype = _qtype;
    }
    
    function decodeQtype(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    function getQclass(){
        return qclass;
    }

    function setQclass(_qclass){
        if(_qclass.value == undefined){
            _qclass = QCLASSES.find(function(item){
                return item.value == parseInt(_qclass);
            });
        }
        qclass = _qclass;
    }

    function decodeQclass(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    function getQuestionStartIndex(){
        return questionStartIndex;
    }

    function setQuestionStartIndex(index){
        questionStartIndex = index;
    }

    function getQuestionLength(){
        return questionLength;
    }

    function setQuestionLength(length){
        questionLength = length;
    }
    
    /**
     * 
     * 
     * @param {any} data - This is the complete message from the as an array of bytes.
     */
    function decodeDNSQuestionFromMessage(data, offset){
        index = offset;
        setQuestionStartIndex(offset);
        setQname(decodeQname(data));
        setQtype(decodeQtype(data[index++], data[index++]));
        setQclass(decodeQtype(data[index++], data[index++]));
        setQuestionLength(index);
    }

    function encodeQuestionForMessage(){

    }

    return{
        getQname: getQname,
        setQname: setQname,
        getQtype: getQtype,
        setQtype: setQtype,
        getQclass: getQclass,
        setQclass: setQclass,
        getQuestionLength: getQuestionLength,
        getQuestionStartIndex: getQuestionStartIndex,
        decodeDNSQuestionFromMessage: decodeDNSQuestionFromMessage
    };

}

module.exports = DNSMesageQuestion;