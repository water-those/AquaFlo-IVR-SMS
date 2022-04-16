import twilio from 'twilio';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const VoiceResponse = twilio.twiml.VoiceResponse;

import serviceAccount from '../../test-api.js';

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '1',
    method: 'POST',
    timeout: 30,
  });

  gather.say(
    `Welcome.
    To check a hand pump\' status press one.
    To report a hand pump as broken, press two.
    To report a hand pump as functional, press three.
    `
  );

  return voiceResponse.toString();
}


export function status_check() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/status_check',
    numDigits: '6',
    method: 'POST',
    timeout: 30,
  });

  gather.say(
    'Please enter a hand pump ID followed by the pound key'
  );

  return voiceResponse.toString();
}

export function report_broken() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/report_broken',
    numDigits: '6',
    method: 'POST',
    timeout: 30,
  });

  gather.say(
    'Please enter the broken hand pump\'s ID followed by the pound key'
  );

  return voiceResponse.toString();
}

export function report_functional() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/report_functional',
    numDigits: '6',
    method: 'POST',
    timeout: 30,
  });

  gather.say(
    'Please enter the functional hand pump\'s ID followed by the pound key'
  );

  return voiceResponse.toString();
}

export function statusCheckHandler(digit) {
  return new Promise((resolve) => {
    db.collection('watersources').limit(1).where('id', '==', parseInt(digit)).get().then((watersources) => {
      const twiml = new VoiceResponse();
      if (watersources.empty) {
        twiml.say('Sorry, hand pump ' + digit  + ' was not found');
        twiml.redirect('/ivr/welcome');
        resolve(twiml.toString());
        return;
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
}


export function reportBrokenHandler(id) {
  return new Promise((resolve) => {
    db.collection('watersources').limit(1).where('id', '==', parseInt(id)).get().then((watersources) => {
      const twiml = new VoiceResponse();
      
      if (watersources.empty) {
        twiml.say('Sorry, hand pump ' + id  + ' was not found');
        twiml.redirect('/ivr/welcome');
        resolve(twiml.toString());
        return;
      }
  
      watersources.docs[0]._ref.set({reported_status: 'broken'}, {merge: true}).then(() => {
        twiml.say(
          'Pump ' + id + ' was reported as broken. Thank you! '
        );
      
        twiml.redirect('/ivr/welcome');
      
        resolve(twiml.toString());
      })
      .catch(error => {
        console.error(error);

        twiml.say("Sorry. Something weng wrong. Please try again.");

        resolve(twiml.toString());
      });
    });
  })
}

export function reportFunctionalHandler(id) {
  return new Promise((resolve) => {
    db.collection('watersources').limit(1).where('id', '==', parseInt(id)).get().then((watersources) => {
      const twiml = new VoiceResponse();
      
      if (watersources.empty) {
        twiml.say('Sorry, hand pump ' + id  + ' was not found');
        twiml.redirect('/ivr/welcome');
        resolve(twiml.toString());
        return;
      }
  
      watersources.docs[0]._ref.set({reported_status: 'functional'}, {merge: true}).then(() => {
        twiml.say(
          'Pump ' + id + ' was reported as functional. Thank you! '
        );
      
        twiml.redirect('/ivr/welcome');
      
        resolve(twiml.toString());
      })
      .catch(error => {
        console.error(error);

        twiml.say("Sorry. Something weng wrong. Please try again.");

        resolve(twiml.toString());
      });
    });
  })
}
