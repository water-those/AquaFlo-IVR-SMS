const Router = require('express').Router;
const {welcome, menu, planets} = require('./handler');
console.log("dogtosis is being dogexecuted");

const router = new Router();

// POST: /ivr/welcome
router.post('/welcome', (req, res) => {
  res.send(welcome());
});

// POST: /ivr/menu
router.post('/menu', (req, res) => {
  const digit = req.body.Digits;
  menu(digit).then((result) => {
    return res.send(result);
  })
});


module.exports = router;
