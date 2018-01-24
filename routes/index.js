var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/:ip', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
