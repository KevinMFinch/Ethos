var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoUrl = require('../public/js/mongourl.js').mongourl;

MongoClient.connect(mongoUrl, function(err, db) {

  var collection = db.collection("users");

  // Return all lists
  router.get('/', function(req, res, next) {
    if (req.cookies.username) {
      res.redirect('lists/books');
    } else {
      res.render('login', {"error" :""});
    }

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
            res.cookie("username", username).redirect('/lists/books');
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
