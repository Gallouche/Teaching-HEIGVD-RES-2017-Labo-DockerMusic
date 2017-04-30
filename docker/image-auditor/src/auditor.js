var dgram = require('dgram');
var clientUDP = dgram.createSocket('udp4');
var moment = require('moment');
var tcp = require('net');

//definition des variables utiles
var PORT = 8080;
var MULTICAST_ADDR = '239.255.22.5';
var TCP_PORT =  2205;
var TCP_ADDRESS = '0.0.0.0';

//definition du dictionnaire instruments
var listInstrument = {
 'ti-ta-ti': 'piano' ,
 'pouet': 'trumpet',
  'trulu': 'flute',
  'gzi-gzi': 'violin',
  'boum-boum': 'drum'
}

//verifiaction du nombre d'argument fourni
if (process.argv.length != 2) {
    console.log('Wrong nomber of arguments, expected 0');
    return;
}

//bind du server sur l'adresse multicast
 clientUDP.bind(PORT, function() {
 clientUDP.addMembership(MULTICAST_ADDR);
  console.log("Listening for broadcasted ads");
});

//map des musiciens actif
var listMusicians = new Map();

//a l'arriver d'un message on le parse, on cree un objet musician et on le stock dans la map
 clientUDP.on('message', function(msg, source) {
    msg = JSON.parse(msg);

    var musician = {
      'uuid' : msg.uuid,
      'instrument' : listInstrument[msg.sound],
      'activeSince' : moment().toISOString()
    };

    console.log("Ad has arrived: '" + musician.instument + "'. Source address: " + source.address + ", source port: " + source.port);

    listMusicians.set(musician.uuid,musician)
});

//on cree le serveur TCP et on fait en sorte qu'il retourne un tableau des musicians
// actif depuis les 5 derniere secondes.
var serverTCP = tcp.createServer(function(socket){
  var musicians = new Array();

  for(var [key, value] of listMusicians){
    if(moment().diff(value.activeSince, 'seconds') > 5){
      listMusicians.delete(key);
    }
    else{
      musicians.push(value);
    }
  }

  socket.end(JSON.stringify(musicians));
});

//on écoute sur le port TCP
serverTCP.listen(TCP_PORT,TCP_ADDRESS);


