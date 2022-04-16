import twilio from 'twilio';
import { Router } from 'express';
import ivrRouter from './ivr/router.js';
import smsRouter from './sms/router.js';

const { webhook } = twilio;
const router = new Router();

// GET: / - home page
router.get('/', (req, res) => {
  return res.send('Home page!');
});

router.use('/sms', webhook({validate: false}), smsRouter);
router.use('/ivr', webhook({validate: false}), ivrRouter);

export default router;
