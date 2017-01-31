/*
 * Created on Sun Jan 29 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */


/**
 * This function will return a representation of a DNS message as described in RFC 1035 4.1 Message Format
 * and also methods for parsing and generating messages.
 */
function DNSMessage() {

    //General
    let header = null;
    let question = null;
    let answer = null;
    let authority = null;
    let additional = null;

    //Header
    

    //Question
    function DNSMesageQuestion(){
        
    }

    //Answer
    function DNSMesageAnswer(){
        
    }

    //Authority
    function DNSMesageAuthority(){
        
    }

    //Additional
    function DNSMesageAdditional(){
        
    }

    return {
        header: header,
        question: question,
        answer: answer,
        authority: authority,
        additional: additional
    };
};

module.exports = DNSMessage;