var express = require('express');
var router = express.Router();

// Return all lists
router.get('/', function(req, res, next) {
  if (req.cookies.username) {
    res.clearCookie("username").redirect('/');
  } else {
    res.redirect('/lists/login');
  }
});

module.exports = router;
