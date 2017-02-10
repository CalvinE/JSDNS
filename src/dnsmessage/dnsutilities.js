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
 * @param {Array} messageData This is the array containing the bytes of DNS message.
 * @param {Number} offset This is the offset to apply to the array to be at the correct index for decoding the name.
 * 
 * @return {Object} This is an object containing an array of labels that constitute the name being decoded and an integer named indexPosPostReading that is the index of the end of the name in the message data..
 */
function decodeName(messageData, offset){
    let index = offset;
    let data = {
        name: [],
        indexPosPostReading: 0
    };
    let length = messageData[index++];
    while(length != 0x00){ //While current label length is not null or 0
        if(length == 0xC0){ //Compression flag detected. Call method again recursively to resolve compression.
            let compressionResolutionArray = decodeName(messageData, messageData[index++]);
            for(let i = 0; i < compressionResolutionArray.name.length; i++){
                data.name.push(compressionResolutionArray.name[i]);
            }
            length = 0x00; //RFC 1035 says that a domain name can end with a pointer, but then there is no null terminating byte, so we need to set the length to 0x00 manually.
        }
        else{
            let namePart = "";
            for(var i = 0; i < length; i++){
                namePart += String.fromCharCode(messageData[index++]);
            }
            data.name.push(namePart);
            length = messageData[index++];        
        }
        
    }
    data.name = data.name;
    data.indexPosPostReading = index;
    return data;
}

/**
 * @name encodeName
 * @access public
 *
 * @description This method encodes a name as defined in RFC 1035 from the DNS message. This method will work with non-compressed and compressed names (RFC 1025 4.1.4).
 * 
 * @param {String} name This is a string representing an array of labels joind with a period.
 * 
 * @return {Array} Array of bytes representing the name as an array of bytes.
 */
function encodeName(name){
    let labelArray = name.split(".");
    let dataArray = [];
    
    for(let i = 0; i < labelArray.length; i++){
        dataArray.push(labelArray[i].length);
        for(let j = 0; j < labelArray[i].length; j++){
            dataArray.push(labelArray[i].charCodeAt(j));
        }
    }

    return dataArray;
}

//Will need to write a post creation dns message compression 

module.exports = {
    decodeName: decodeName,
    encodeName: encodeName
};