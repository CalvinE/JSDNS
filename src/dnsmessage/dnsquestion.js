/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const QTYPES = require("../dnsmessage/constants/qtypes");
const QCLASSES = require("../dnsmessage/constants/qclasses");

/**
 * @name DNSMesageQuestion
 * @class {DNSMesageQuestion} DNSMesageQuestion
 * @access public
 * 
 * @description A representation of a DNS message question and functions for encoding this data for reading and decoding this data for transmission.
 */
function DNSMesageQuestion(){
    /**
     * @name qname
     * @access private
     * @type {Array}
     * 
     * @description A domain name represented as a sequence of labels, where each label consists of a length octet followed by that number of octets. The domain name terminates with the zero length octet for the null label of the root. Note that this field may be an odd number of octets; no padding is used.
     */
    let qname = null;

    /**
     * @name qtype
     * @access private
     * @type {Object}
     * 
     * @description A two octet code which specifies the type of the query. The values for this field include all codes valid for a TYPE field, together with some more general codes which can match more than one type of RR.
     */
    let qtype = null;
    
    /**
     * @name qclass
     * @access private
     * @type {Object}
     * 
     * @description A two octet code that specifies the class of the query. For example, the QCLASS field is IN for the Internet.
     */
    let qclass = null;
    
    /**
     * @name questionStartIndex
     * @access private
     * @type {int}
     * 
     * @description This is the absolute position in the byte array where this question begins.
     */
    let questionStartIndex = null;
    
    /**
     * @name questionLength
     * @access private
     * @type {int}
     * 
     * @description This is the length of the question in bytes.
     */
    let questionLength = null;

    /**
     * @name index
     * @access private
     * @type {int}
     * 
     * @description This variable is used to keep track of the current index as we parse the question data.
     */
    let index = 0;

    /**
     * @name getQname
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qname.
     * 
     * @returns {array | null} The current value of the qname variable..
     */
    function getQname(){
        return qname;
    }

    /**
     * @name setQname
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qname.
     * 
     * @param {Array} _qname An array of strings ("labels") representing the domain name of the question.
     */
    function setQname(_qname){
        qname = _qname;
    }

    /**
     * @name decodeQname
     * @access private
     * @type {Function}
     * 
     * @description Decodes the domain name from the question data.
     * 
     * @param {Array} qNameBytes This is the array of bytes that represent the entire DNS message.
     */
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

    /**
     * @name getQtype
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qtype.
     * 
     * @returns {Object} The current value of the qtype variable.
     */
    function getQtype(){
        return qtype;
    }

    /**
     * @name setQtype
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qtype.
     * 
     * @param {Object} _qtype An object representing the QType from the QTypes module.
     */
    function setQtype(_qtype){
        if(_qtype.value == undefined){
            _qtype = QTYPES.find(function(item){
                return item.value == parseInt(_qtype);
            });
        }
        qtype = _qtype;
    }
    
    /**
     * @name decodeQtype
     * @access private
     * @type {Function}
     * 
     * @description Decodes the QType from the question data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the QType in the question.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the QType in the question.
     */
    function decodeQtype(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    /**
     * @name getQclass
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return qclass.
     * 
     * @returns {Object} The current value of the qclass variable.
     */
    function getQclass(){
        return qclass;
    }

    /**
     * @name setQclass
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for qclass.
     * 
     * @param {Object} _qclass An object representing the QClass from the QClasses module.
     */
    function setQclass(_qclass){
        if(_qclass.value == undefined){
            _qclass = QCLASSES.find(function(item){
                return item.value == parseInt(_qclass);
            });
        }
        qclass = _qclass;
    }

    /**
     * @name decodeQclass
     * @access private
     * @type {Function}
     * 
     * @description Decodes the QClass from the question data.
     * 
     * @param {Uint8} highByte High byte of the 16 bits representing the QClass in the question.
     * @param {Uint8} lowByte Low byte of the 16 bits representing the QClass in the question.
     */
    function decodeQclass(highByte, lowByte){
        return (highByte << 8) | lowByte;
    }

    /**
     * @name getQuestionStartIndex
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return questionStartIndex.
     * 
     * @returns {int} The current value of the questionStartIndex variable.
     */
    function getQuestionStartIndex(){
        return questionStartIndex;
    }

    /**
     * @name setQuestionStartIndex
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for questionStartIndex.
     * 
     * @param {int} index An integer representing the starting index of this question relative to the whole message.
     */
    function setQuestionStartIndex(index){
        questionStartIndex = index;
    }

    /**
     * @name getQuestionLength
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return questionLength.
     * 
     * @returns {int} The current value of the questionLength variable.
     */
    function getQuestionLength(){
        return questionLength;
    }

    /**
     * @name setQuestionLength
     * @access public
     * @type {Function}
     * 
     * @description This is the setter method for questionLength.
     * 
     * @param {int} length An the length of this message as a part of the whole DNS message.
     */
    function setQuestionLength(length){
        questionLength = length;
    }
    
    /**
     * @name decodeDNSQuestionFromMessage
     * @access public
     * @type {Function}
     * 
     * @description This function takes the byte array containing the DNS message and populates the model with the messages question data at the specified offset in the array.
     * 
     * @param {array} data This is an array containing the bytes of the complete DNS message.
     * @param {int} offset This is an integer representing the offset to be used for parsing the question data.
     */
    function decodeDNSQuestionFromMessage(data, offset){
        index = offset;
        setQuestionStartIndex(index);
        setQname(decodeQname(data));
        setQtype(decodeQtype(data[index++], data[index++]));
        setQclass(decodeQtype(data[index++], data[index++]));
        setQuestionLength(index);
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