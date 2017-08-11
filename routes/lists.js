var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');


var mongoUrl = "mongodb://localhost:27017/Ethos";

MongoClient.connect(mongoUrl, function(err, db) {
  
  var collection = db.collection("lists");

  // Return all lists
  router.get('/', function(req, res, next) {
    collection.find({}).toArray(function(err, docs) {
      res.render('lists', {docs : docs});
    })
  });

  // Returns all the lists belonging to the particular user
  router.get('/owner/:userName', function(req, res, next) {
    var userName = req.params.userName;
    collection.find({"owner": userName}).toArray(function(err, docs) {
      res.render('listview', {docs: docs});
    })
  });

  // Submit list post
  router.post('/planned', function(req, res){    
    var item = req.body.item;
    var username = req.cookies.username;
    var category = req.body.category;
    collection.findOne({"owner" : username}, function(err, doc) {
      var plannedArray = doc.planned;
      plannedArray.push(item);
      collection.update({"owner": username, "category": category},{ $set: {"planned" : plannedArray}}, {multi: true}, function(err, doc) {
        res.redirect('/lists/owner/' + username);
      })
    })
  });

})

module.exports = router;