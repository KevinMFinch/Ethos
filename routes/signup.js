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
    var username = req.body.username.toLowerCase();
    db.collection("users").find({"username" : username}).toArray(function(err, docs) {
      if (docs.length > 0) {
         res.render('signup', {"error" : "username already exists"});
      } else {
        var listIDs = [];
        var insertDocs = [];
        var listCategories = ["Books", "Movies", "TV Shows", "Music", "Video Games"];
        for (var i = 0; i < listCategories.length; i++) {
          insertDocs.push(listModel.list(username, listCategories[i]));
        }

        db.collection("lists").insertMany(insertDocs, function(err, response) {
          listIDs = response.insertedIds;
          var plainPass = req.body.password;
          var validatePass = req.body.validatePassword;
          if (plainPass == validatePass) {
            bcrypt.hash(plainPass, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            db.collection("users").insertOne({
                "username" : username,
                "email" : req.body.email,
                "password" : hash,
                "listIDs" : listIDs
              }, function(err, r) {
                res.cookie("username", username).redirect("/lists/owner/" + username);
              });
            });
          } else {
            res.render('signup', {"error" : "Passwords don't match"});
          }
        });
      }
    });
  });
})

module.exports = router;
