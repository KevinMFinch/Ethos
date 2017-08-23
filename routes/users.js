var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var router = express.Router();

var mongoUrl = require('../public/js/mongourl.js').mongourl;

MongoClient.connect(mongoUrl, function(err, db) {
  /* GET home page. */
  var collection = db.collection("users");

  router.get('/', function(req, res, next) {
    collection.find({}).toArray(function(err, docs) {
      res.json(JSON.stringify(docs));
    })
  });

})

module.exports = router;
