var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoUrl = "mongodb://localhost:27017/Ethos";

MongoClient.connect(mongoUrl, function(err, db) {
  
  var collection = db.collection("users");

  // Return all lists
  router.get('/', function(req, res, next) {
    res.render('login', {"error" :""});
  });

  // Submit list post
  router.post('/', function(req, res){    
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    collection.find({"username" : username}).toArray(function(err, docs) {
      if (docs.length > 0) {
        var hash = docs[0].password;
        bcrypt.compare(password, hash, function(err, passMatch) {
          if (passMatch == true) {
            res.redirect('/lists/owner/' + username);
          }
          else {
            res.render('login', {"error" : "Incorrect password."});
          }
        });
      }
      else {
        res.render('login', {"error" : "Username does not exist."});
      }
    })
    
  });

})

module.exports = router;