var PORT = 8080;
var MULTICAST_ADDR = '239.255.22.5';
var dgram = require('dgram');
const uuid = require('uuid/v1');
var s = dgram.createSocket('udp4');

//dictionnaire des instrument
var listInstrument = {
 'piano': 'ti-ta-ti',
  'trumpet': 'pouet',
  'flute': 'trulu',
  'violin': 'gzi-gzi',
  'drum': 'boum-boum'
}

//verification du nombre d'aruments
if (process.argv.length != 3) {
    console.log('Wrong nomber of arguments, expected 1');
    return;
}

//récupération de l'argument (instrument souhaiter)
var instrArg = process.argv[2];

//génération d'un id unique
var uniqueID = uuid();

//définition d'un intervalle d'envoi des données
setInterval(multicastNew, 1000);

//fonction de création d'objet, parsing en JSON, et envoie sur l'adresse de multicast
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