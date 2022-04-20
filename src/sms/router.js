
import { Router } from 'express';
import twilio from 'twilio';
import { getSMSResponse } from './handler.js';

const MessagingResponse = twilio.twiml.MessagingResponse;

const router = new Router();

// POST: /sms
router.post('/', (req, res) => {
  // Grabs `Body` field from Twilio's request 
  // See here for more: https://www.twilio.com/docs/messaging/guides/webhook-request
  // TODO: SANITIZE INPUT!!!!!!!!!!!!!!
  const body = req.body.Body;
  const twiml = new MessagingResponse();

  getSMSResponse(body).then(smsResponse => {
    twiml.message(smsResponse);
    res.send(twiml.toString());
  });
});


export default router;
