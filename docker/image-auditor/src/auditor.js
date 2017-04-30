var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var PORT = 6024;
var MULTICAST_ADDR = '239.255.255.250';

var listInstrument = {
  piano: 'ti-ta-ti',
  pouet: 'trumpet',
  trulu: 'flute',
  gzi-gzi: 'violin',
  drum: 'boum-boum',
}

client.bind(PORT, function() {
  client.addMembership(MULTICAST_ADDR);
  console.log("Listening for broadcasted ads");
});


client.on('message', function(msg, source) {
    console.log("Ad has arrived: '" + msg + "'. Source address: " + source.address + ", source port: " + source.port);

    msg = JSON.parse(msg);

    var musician = {
      'uuid' : msg.uuid
    }
});

var listMusicians = new Map();


