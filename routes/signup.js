var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var router = express.Router();

var listModel = require('../public/js/list.js');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoUrl = "mongodb://localhost:27017/Ethos";


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', {"error" :""});
});


MongoClient.connect(mongoUrl, function(err, db) {
  /* GET home page. */
  var collection = db.collection("users");

  // Receive the post request for a signup
  router.post('/', function(req, res, next) {
    db.collection("users").find({"username" : req.body.username.toLowerCase()}).toArray(function(err, docs) {
      if (docs.length > 0) {
         res.render('signup', {"error" : "username already exists"});
      } else {
        var listIDs = [];
        var insertDocs = [];
        var listCategories = ["Books", "Movies", "TV Shows", "Music", "Video Games"];
        for (var i = 0; i < listCategories.length; i++) {
          insertDocs.push(listModel.list(req.body.username.toLowerCase(), listCategories[i]));
        }

        db.collection("lists").insertMany(insertDocs, function(err, response) {
          listIDs = response.insertedIds;
          console.log(listIDs);
          var plainPass = req.body.password;
          bcrypt.hash(plainPass, saltRounds, function(err, hash) {
            // Store hash in your password DB. 
            db.collection("users").insertOne({
                "username" : req.body.username.toLowerCase(),
                "email" : req.body.email,
                "password" : hash,
                "listIDs" : listIDs
              }, function(err, r) {
                res.cookie("username", req.body.username.toLowerCase()).redirect("/lists/owner/" + req.body.username.toLowerCase());
            });
          });
        });
      }
    });
    
  });
})

module.exports = router; 