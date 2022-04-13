const Router = require('express').Router;
const {
  welcome, 
  status_check, 
  statusCheckHandler,
  reportFunctionalHandler,
  reportBrokenHandler, 
  report_broken, 
  report_functional
} = require('./handler');

const router = new Router();

// POST: /ivr/welcome
router.post('/welcome', (req, res) => {
  res.send(welcome());
});

// POST: /ivr/menu
router.post('/menu', (req, res) => {
  const digit = req.body.Digits;

  const menu_mapping = {
    1: status_check,
    2: report_broken,
    3: report_functional,
  };

  res.send(menu_mapping[parseInt(digit)] ? menu_mapping[parseInt(digit)]() : welcome());
});

// POST: /ivr/status_check
router.post('/status_check', (req, res) => {
  const digit = req.body.Digits;
  statusCheckHandler(digit).then((result) => {
    return res.send(result);
  })
});

// POST: /ivr/report_broken
router.post('/report_broken', (req, res) => {
  const digit = req.body.Digits;
  reportBrokenHandler(parseInt(digit)).then((twiml) => {
    return res.send(twiml);
  });
});

// POST: /ivr/report_functional
router.post('/report_functional', (req, res) => {
  const digit = req.body.Digits;
  reportFunctionalHandler(parseInt(digit)).then((twiml) => {
    return res.send(twiml);
  })
});


module.exports = router;
