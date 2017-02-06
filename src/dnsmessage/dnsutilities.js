/*
 * Created on Sun Feb 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

/**
 * @name decodeName
 * @access public
 *
 * @description This method decodes names as defined in RFC 1035 from the DNS message. This method will work with non-compressed and compressed names (RFC 1025 4.1.4).
 * 
 * @param {array} messageData This is the array containing the bytes of DNS message.
 * @param {int} offset This is the offset to apply to the array to be at the correct index for decoding the name.
 * 
 * @return {array} This is an array of labels that constitute the name being decoded.
 */
function decodeName(messageData, offset){
    let index = offset;
    let qName = [];
    let length = messageData[index++];
    while(length != 0x00){ //While current label length is not null or 0
        if(length == 0xC0){ //Compression flag detected. Call method again recursively to resolve compression.
            let compressionResolutionArray = decodeName(messageData, messageData[index++]);
            for(let i = 0; i < compressionResolutionArray.length; i++){
                qName.push(compressionResolutionArray[i]);
            }
            length = 0x00; //TODO: The way the RFC reads the message ends after the compressed data... Need to confirm this.
            //messageData[index++];
        }
        else{
            let qNamePart = "";
            for(var i = 0; i < length; i++){
                qNamePart += String.fromCharCode(messageData[index++]);
            }
            qName.push(qNamePart);
            length = messageData[index++];
        }
        
    }
    return qName;

}

module.exports = {
    decodeName: decodeName
};