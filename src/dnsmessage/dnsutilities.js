/*
 * Created on Sun Feb 05 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

let Utilities = require('../utilities')

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
function decodeName (messageData, offset) {
  let index = offset
  let data = {
    name: [],
    indexPosPostReading: 0
  }
  let length = messageData[index++]
  while (length !== 0x00) { // While current label length is not null or
    let isCompressed = ((length & 0xC0) === 0xC0)
    if (isCompressed === true) { // Compression flag detected. Call method again recursively to resolve compression.
      let compressionOffsetLowerByte = messageData[index++]
      let compressionOffset = (((length & 0x3F) << 8) | (compressionOffsetLowerByte))

      let compressionResolutionArray = decodeName(messageData, compressionOffset)
      for (let i = 0; i < compressionResolutionArray.name.length; i++) {
        data.name.push(compressionResolutionArray.name[i])
      }
      length = 0x00 // RFC 1035 says that a domain name can end with a pointer, but then there is no null terminating byte, so we need to set the length to 0x00 manually.
    } else {
      let namePart = ''
      for (var i = 0; i < length; i++) {
        namePart += String.fromCharCode(messageData[index++])
      }
      data.name.push(namePart)
      length = messageData[index++]
    }
  }
  data.name = data.name
  data.indexPosPostReading = index
  return data
}

/**
 * @name encodeName
 * @access public
 *
 * @description This method encodes a name as defined in RFC 1035 from the DNS message. This method will work with non-compressed and compressed names (RFC 1025 4.1.4).
 *
 * @param {String} name This is a string representing an array of labels joind with a period.
 * @param {Array.<Object>}  otherNameData If this is populated then the data in this array will be
 *
 * @return {Array} Array of bytes representing the name as an array of bytes.
 */
function encodeName (name, otherNameData) {
  let labelArray = name.split('.')
  let dataArray = []
  let compressed = false
  otherNameData = otherNameData || []
  if (otherNameData.length > 0) {
    for (let i = 0; i < otherNameData.length; i++) {
      while (compressed === false && labelArray.length !== 0) {
        let originalOtherNameLabels = otherNameData[i].name.split('.')
        let otherNameLabels = otherNameData[i].name.split('.')
        let otherNameLabelsSkipped = 0
        while (compressed === false && otherNameLabels.length !== 0) {
                    // attempt to find matches and compress!
          let nameRegex = new RegExp('^' + otherNameLabels.join('.') + '$')
          var matches = labelArray.join('.').match(nameRegex)
          if (Utilities.isNullOrUndefined(matches)) {
            otherNameLabels.shift()
            otherNameLabelsSkipped += 1
          } else {
            let offset = otherNameData[i].startingIndex
            for (let j = 0; j < otherNameLabelsSkipped; j++) {
              offset += originalOtherNameLabels[j].length + 1
            }
                        // TODO: make it so that we use the 14 bits for the offset instead of the lower 8 only!
            dataArray.push(0xC0)
            dataArray.push(offset)
            compressed = true
            break
          }
        }
        if (compressed === false) {
          let label = labelArray.shift()
          let encodedLabel = encodeLabel(label)
          for (let j = 0; j < encodedLabel.length; j++) {
            dataArray.push(encodedLabel[j])
          }
        }
      }
      if (compressed === true) {
        break
      }
    }
  } else {
    for (let i = 0; i < labelArray.length; i++) {
      let encodedLabel = encodeLabel(labelArray[i])
      for (let j = 0; j < encodedLabel.length; j++) {
        dataArray.push(encodedLabel[j])
      }
    }
  }
  if (compressed === false) {
    dataArray.push(0x00)
  }
  return dataArray
}

/**
 * @name encodeLabel
 * @access private
 *
 * @description This is a method that encodes a single label.
 *
 * @param {String} label
 *
 * @returns {Array} Array of bytes representing the label.
 */
function encodeLabel (label) {
  let dataArray = []
  dataArray.push(label.length)
  for (let j = 0; j < label.length; j++) {
    dataArray.push(label.charCodeAt(j))
  }
  return dataArray
}

// Will need to write a post creation dns message compression

module.exports = {
  decodeName: decodeName,
  encodeName: encodeName
}
