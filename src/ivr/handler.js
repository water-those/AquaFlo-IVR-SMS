const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '1',
    method: 'POST',
    timeout: 30,
  });

  gather.say(
    'i am a robot and i can say words such as spagetti and spinach and continue um' + 
    'press a key and i will try my best to repeat it back to you',
    {loop: 3}
  );

  return voiceResponse.toString();
};

exports.menu = function menu(digit) {
  console.log("Got some digits!");
  console.log(digit);

  const twiml = new VoiceResponse();
  twiml.say(
    'you just pressed ' + digit
  );

  twiml.redirect('/ivr/welcome');

  return twiml.toString();
};
