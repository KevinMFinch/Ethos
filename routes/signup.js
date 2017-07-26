var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var router = express.Router();

var listModel = require('../public/js/list.js');

var mongoUrl = "mongodb://localhost:27017/Ethos";


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup');
});


MongoClient.connect(mongoUrl, function(err, db) {
  /* GET home page. */
  var collection = db.collection("users");

  // Receive the post request for a signup
  router.post('/', function(req, res, next) {
    var listIDs = [];
    var insertDocs = [];
    var listCategories = ["Books", "Movies", "TV Shows", "Music", "Video Games"];
    for (var i = 0; i < listCategories.length; i++) {
      insertDocs.push(listModel.list(req.body.username, listCategories[i]));
    }

    db.collection("lists").insertMany(insertDocs, function(err, response) {
      for(var objID in response.insertedIds) {
        listIDs.push(objID.toString());
      }
    });
    console.log(req.body.username);
    db.collection("users").insertOne({
      "username" : req.body.username,
      "email" : req.body.email,
      "password" : req.body.password,
      "listIDs" : listIDs
    }, function(err, r) {
      res.json(r);
    });
  });

})



module.exports = router; 