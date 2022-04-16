import twilio from 'twilio';
import { Router } from 'express';
import ivrRouter from './ivr/router.js';

const { webhook } = twilio;
const router = new Router();

// GET: / - home page
router.get('/', (req, res) => {
  res.render('index');
});

router.use('/ivr', webhook({validate: false}), ivrRouter);

export default router;
