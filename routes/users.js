
var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var router = express.Router();

var mongoUrl = "mongodb://localhost:27017/jl-memes";

MongoClient.connect(mongoUrl, function(err, db) {
  /* GET home page. */
  var collection = db.collection("documents");

  router.get('/', function(req, res, next) {
    collection.find({}).toArray(function(err, docs) {
      res.send(JSON.stringify(docs));
    })
  });

})



module.exports = router;

