/*
 * Created on Mon Jan 30 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const QTYPES = require("../dnsmessage/constants/qtypes");
const QCLASSES = require("../dnsmessage/constants/qclasses");
const DNSUtils = require("../dnsmessage/dnsutilities");
const Utilities = require("../utilities");

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
     * @type {String}
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
     * @type {Number}
     * 
     * @description This is the absolute position in the byte array where this question begins.
     */
    let questionStartIndex = null;
    
    /**
     * @name questionLength
     * @access private
     * @type {Number}
     * 
     * @description This is the length of the question in bytes.
     */
    let questionLength = null;

    /**
     * @name index
     * @access private
     * @type {Number}
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
     * @returns {String} The current value of the qname variable..
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
     * @param {String} _qname A string of labels delimited by a . character.
     */
    function setQname(_qname){
        qname = _qname;
    }

    /**
     * @name decodeQname
     * @access private
     * @type {Function}
     * 
     * @description Decodes the domain name from the question data. Also it advances the index variable to keep track of how to parse the message.
     * 
     * @param {Array} qNameBytes This is the array of bytes that represent the entire DNS message.
     * 
     * @returns {String} A period delimited list of labels with the TLD in the last index.
     */
    function decodeQname(qNameBytes){
        let qNameData = DNSUtils.decodeName(qNameBytes, index);
        index = qNameData.indexPosPostReading;
        return qNameData.name.join(".");
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
     * @param {Object | Number} _qtype An object representing the QType from the QTypes module.
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
     * @param {Object | Number} _qclass An object representing the QClass from the QClasses module.
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
     * @name getQuestionStartIndex
     * @access public
     * @type {Function}
     * 
     * @description This is the getter method to return questionStartIndex.
     * 
     * @returns {Number} The current value of the questionStartIndex variable.
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
     * @param {Number} index An integer representing the starting index of this question relative to the whole message.
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
     * @returns {Number} The current value of the questionLength variable.
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
     * @param {Number} length An the length of this message as a part of the whole DNS message.
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
     * @param {Uint8Array} data This is an array containing the bytes of the complete DNS message.
     * @param {Number} offset This is an integer representing the offset to be used for parsing the question data.
     */
    function decodeDNSQuestionFromMessage(data, offset){
        index = offset;
        setQuestionStartIndex(index);
        setQname(decodeQname(data));
        setQtype(Utilities.decode16BitValue(data[index++], data[index++]));
        setQclass(Utilities.decode16BitValue(data[index++], data[index++]));
        setQuestionLength(index-offset);

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