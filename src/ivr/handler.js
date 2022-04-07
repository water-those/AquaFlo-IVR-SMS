const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../../test-api.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '6',
    method: 'POST',
    timeout: 30,
  });

  gather.say(
    'Please enter a hand pump ID followed by the pound key'
  );

  return voiceResponse.toString();
};

exports.menu = function menu(digit) {
  return new Promise((resolve) => {
    db.collection('watersources').limit(1).where('id', '==', parseInt(digit)).get().then((watersources) => {
      const twiml = new VoiceResponse();
      if (watersources.empty) {
        twiml.say('Sorry, hand pump ' + digit  + ' was not found');
        twiml.redirect('/ivr/welcome');
        resolve(twiml.toString());
      }
  
      let response = "";
      watersources.forEach((doc) => {
        response += doc.data()["reported_status"];
        console.log(doc.data()["reported_status"]);
      });
    
      twiml.say(
        'The status of hand pump ' + digit + ' is ' + response
      );
    
      twiml.redirect('/ivr/welcome');
    
      resolve(twiml.toString());
    });
  })
};
