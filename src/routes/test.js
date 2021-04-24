const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/test', (req, res) => {
  res.send('Test is working!');
});

module.exports = router;