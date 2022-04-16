
import { Router } from 'express';
import twilio from 'twilio';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const MessagingResponse = twilio.twiml.MessagingResponse;

const router = new Router();

// POST: /sms
router.post('/', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('bingus');

  return res.send(twiml.toString());
});


export default router;
