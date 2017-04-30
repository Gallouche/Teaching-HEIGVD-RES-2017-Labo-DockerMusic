var dgram = require('dgram');
var clientUDP = dgram.createSocket('udp4');
var moment = require('moment');
var tcp = require('net');

var PORT = 6024;
var MULTICAST_ADDR = '239.255.255.250';
var TCP_PORT =  2205;
var TCP_ADDRESS = '0.0.0.0';

var listInstrument = {
 'ti-ta-ti': 'piano' ,
 'pouet': 'trumpet',
  'trulu': 'flute',
  'gzi-gzi': 'violin',
  'boum-boum': 'drum'
}

if (process.argv.length != 2) {
    console.log('Wrong nomber of arguments, expected 0');
    return;
}
 clientUDP.bind(PORT, function() {
 clientUDP.addMembership(MULTICAST_ADDR);
  console.log("Listening for broadcasted ads");
});

var listMusicians = new Map();

 clientUDP.on('message', function(msg, source) {
    msg = JSON.parse(msg);

    var musician = {
      uuid : msg.uuid,
      instument : listInstrument[msg.sound],
      arrived : moment().toISOString()
    }

    console.log("Ad has arrived: '" + musician.instument + "'. Source address: " + source.address + ", source port: " + source.port);

    listMusicians.set(musician.uuid,musician)
});

var serverTCP = tcp.createServer(function(socket){
  var musicians = new Array();

  for(var [key, value] of listMusicians){
    if(moment().diff(value.arrived, 'seconds') > 5){
      listMusicians.delete(key);
    }
    else{
      musicians.push(value.instument);
    }
  }

  socket.end(JSON.stringify(musicians));
});

serverTCP.listen(TCP_PORT,TCP_ADDRESS);


