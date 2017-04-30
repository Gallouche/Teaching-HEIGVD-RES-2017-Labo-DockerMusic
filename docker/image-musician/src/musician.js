// Sending a message to all nodes on the local network
var SRC_PORT = 6025;
var PORT = 6024;
var MULTICAST_ADDR = '239.255.255.250';
var dgram = require('dgram');
const uuid = require('uuid/v1');
var s = dgram.createSocket('udp4');

var listInstrument = {
 'piano': 'ti-ta-ti',
  'trumpet': 'pouet',
  'flute': 'trulu',
  'violin': 'gzi-gzi',
  'drum': 'boum-boum'
}

if (process.argv.length != 3) {
    console.log('Wrong nomber of arguments, expected 1');
    return;
}

var instrArg = process.argv[2];

var uniqueID = uuid();

setInterval(multicastNew, 1000);

function multicastNew() {
  var message = {
    sound : listInstrument[instrArg],
    uuid : uniqueID
  }
  message = new Buffer(JSON.stringify(message));
  
  s.send(message, 0, message.length, PORT, MULTICAST_ADDR, function (err, bytes) {
    console.log("Sending ad: " + message + " via port " + s.address().port);
  });
};