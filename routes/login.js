var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


var mongoUrl = "mongodb://localhost:27017/Ethos";

MongoClient.connect(mongoUrl, function(err, db) {
  
  var collection = db.collection("users");

  // Return all lists
  router.get('/', function(req, res, next) {
    res.render('login');
  });

  // Submit list post
  router.post('/', function(req, res){    
    var username = req.body.username;
    var password = req.body.password;
    collection.find({"username" : username, "password" : password}).toArray(function(err, docs) {
      if (docs.length > 0) {
        res.redirect('/lists/owner/' + username);
      }
    })
    
  });

})

module.exports = router;