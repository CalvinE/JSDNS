/*
 * Created on Sat Jan 28 2017
 *
 * Copyright (c) 2017 Calvin Echols - calvin.echols@gmail.com
 */

const net = require('net');

/**
 * 
 * 
 * @returns public interface for this module.
 */
function JSDNS() {
  
  let server = null;

  let config = null;
  
  /**
   * 
   * 
   * @param {any} config
   */
  function init(_config){
    config = {
                'port': 53  
             };
    createServer();
  }

  /**
   * 
   */
  function createServer(){
    server = net.createServer({
      allowHalfOpen: false,
      pauseOnConnect: false
    }, (socket) => {
      socket.on("close", (wasError) => {
        console.log("Socket closed!");
      }).on("connect", () =>{
        console.log("Socket connected!");
      }).on("data", (data) => {
        console.log("Socket Data Received!");
      }).on("drain", () => {
        console.log("Socket Occurred!");
      }).on("end", () => {
        console.log("Socket Ended!");
      }).on("error", (err) => {
        console.log("Socket Error Occurred!", err);
      }).on("lookup", (err, address, family, host) => {
        console.log("Socket Lookup!");
      }).on("timeout", () => {
        console.log("Socket timeout!");
      })
    }).on("close", () => {
      console.log("Server closed.");
    }).on("error", (err) => {
      console.log("Server error occurred.");
    }).on("listening", () => {
      console.log("Server is listening");
    });

    server.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  }

  function isServerListening(){
    return server.listening;
  }

  return {
    init: init,
    server: server
  };

};

module.exports = JSDNS();