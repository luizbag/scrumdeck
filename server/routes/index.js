var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/newgame', function(req, res, next) {
  res.redirect('/game.html');
});

module.exports = router;
